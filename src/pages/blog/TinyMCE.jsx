import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TinyMCE() {
  const formData = new FormData();
  formData.append("test", "Acha")
  const handleImageUpload = (blobInfo, success, failure, progress) => {
    return new Promise((resolve, reject) => {
      // const xhr = new XMLHttpRequest();
      // xhr.open('POST', 'http://localhost:3001/tinymce/upload', true);

      // formData.append('image', blobInfo.blob(), blobInfo.filename());
      formData.append('image', blobInfo.blob(), blobInfo.filename());
      setTimeout(() => {
      }, 1000);
      // xhr.upload.onprogress = (e) => {
      //   if (progress && typeof progress === 'function') {
      //     progress((e.loaded / e.total) * 100);
      //   }
      // };

      // xhr.onload = () => {
      //   if (xhr.status === 200) {
      //     const response = JSON.parse(xhr.responseText);
      //     resolve(response.location);
      //   } else {
      //     reject('Image upload failed');
      //   }
      // };

      // xhr.onerror = () => {
      //   reject('Image upload failed');
      // };


      // xhr.send(formData);
    });
  };

  return (
    <Editor
      apiKey="your-api-key"
      initialValue="<p>Try adding an image with image upload!</p>"
      init={{
        height: 500,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount',
        ],
        toolbar:
          'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        images_upload_url: 'http://localhost:3001/tinymce/upload',
        automatic_uploads: true,
        images_reuse_filename: true,
        images_upload_handler: handleImageUpload,
      }}
    />
  );
}
