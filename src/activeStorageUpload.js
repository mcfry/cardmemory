import { DirectUpload } from 'activestorage/src/direct_upload';

const RAS_URL = `http://0.0.0.0:3001/rails/active_storage/direct_uploads`;

/**
 * Promisify the create method provided by DirectUpload.
 * @param  {object} upload DirectUpload instance
 * @return {promise}       returns a promise to be used on async/await
 */
function createUpload(upload) {
  return new Promise((resolve, reject) => {
    upload.create((err, blob) => {
      if (err) reject(err);
      else resolve(blob);
    });
  });
}

/**
 * Upload to service using ActiveStorage DirectUpload module
 * @param  {Object} file Image buffer to be uploaded.
 * @return {Object}      blob object from server.
 * @see https://github.com/rails/rails/issues/32208
 */
async function activeStorageUpload(file, headers) {
  let imageBlob;
  const upload = new DirectUpload(file, RAS_URL, {
    directUploadWillCreateBlobWithXHR: xhr => {
      for (let key in headers) {
        xhr.setRequestHeader(key, headers[key]);
      }
    }
  });

  try {
    imageBlob = await createUpload(upload);
  } catch (err) {
    throw err;
  }

  /* 
    When you reach this block of code, then you can expect a Blob to exist in your Rails backend now. 
    It is, however, not connected to any models. When you're here, just use your services to talk to rails normally.

    To connect it, send the imageBlob.signed_id.
  */
  return imageBlob;
}

export default activeStorageUpload;