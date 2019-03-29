export function getFiles(prefix: string): Promise<FileEntry[]> {
  return new Promise((resolve, reject) => {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fs) => {
      fs.root.createReader().readEntries((entries: FileEntry[]) => {
        resolve(entries.filter(e => e.isFile && e.name.includes(prefix)))
      }, reject)
    }, reject)
  })
}

export function getLocalFileOrDowload(remoteFileUri: string, fileName: string, prefix: string, onProgress?: (e: ProgressEvent) => void): Promise<FileEntry> {
  return new Promise((resolve, reject) => {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fs) => {
      fs.root.getFile(prefix + fileName, undefined, (fe) => {
        fe.file(f => {
          if (f.size > 0) {
            resolve(fe)
          } else {
            syncRemoteFile(fs, remoteFileUri, fileName, prefix, onProgress)
            .then(resolve)
            .catch(reject)
          }
        }, reject)
      }, (err: FileError) => {
        if (err.code === FileError.NOT_FOUND_ERR) {
          syncRemoteFile(fs, remoteFileUri, fileName, prefix, onProgress)
          .then(resolve)
          .catch(reject)
        } else {
          reject(err)
        }
      })
    }, reject)
  })
}

function syncRemoteFile(fs: FileSystem, remoteFileUri: string, fileName: string, prefix: string, onProgress?: (e: ProgressEvent) => void): Promise<FileEntry> {
  return new Promise((resolve, reject) => {
    fs.root.getFile(
      prefix + fileName,
      { create: true, exclusive: false },
      (fileEntry) => {
        const writeAndRetry = (blob: Blob, nbRetries: number = 0) => {
          write(fileEntry, blob)
          .then(resolve)
          .catch(err => {
            console.error(err)
            if (nbRetries <= 5) {
              setTimeout(writeAndRetry(blob, nbRetries + 1))
            } else {
              reject(err)
            }
          })
        }
        download(remoteFileUri, onProgress)
        .then(blob => {
          writeAndRetry(blob)
        })
        .catch(reject)
      },
      reject
    )
  })
}

function write(fileEntry: FileEntry, data: Blob): Promise<FileEntry> {
  return new Promise((resolve, reject) => {
    fileEntry.createWriter(fileWriter => {
      fileWriter.onwriteend = () => resolve(fileEntry)
      fileWriter.onerror = reject
      fileWriter.write(data)
    }, reject)
  })
}

function download(remoteURI: string, onProgress?: (e: ProgressEvent) => void): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const client = new XMLHttpRequest()
    client.open('GET', remoteURI, true)
      client.responseType = 'blob'
      if (onProgress) {
        client.onprogress = onProgress
      }
      client.onload = () => {
        if (client.response) {
          resolve(client.response)
        } else {
          reject('could not get file')
        }
      }
      client.send()
  })
}
