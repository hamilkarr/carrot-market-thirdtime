'use client';

import { FormButton } from '@/components/form-btn';
import { FormInput } from '@/components/form-input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { ChangeEvent, useActionState, useState } from 'react';
import { getUploadUrl, uploadProduct } from './actions';

export default function AddProduct() {
  const [preview, setPreview] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [imageId, setImageId] = useState('');
  const onImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      const file = files[0];

      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }

      // 파일 크기가 4MB 이하인지 확인
      if (file.size > 4 * 1024 * 1024) {
        alert('파일 크기는 4MB 이하이어야 합니다.');
        return;
      }

      setPreview(URL.createObjectURL(file));
      const { success, result } = await getUploadUrl();
      if (success) {
        const { id, uploadURL } = result;
        setUploadUrl(uploadURL);
        setImageId(id);
      }
    }
  };
  const preUploadImage = async (_: any, formData: FormData) => {
    const cloudFlareForm = new FormData();
    const file = formData.get('photo') as File;
    if (!file) return;
    cloudFlareForm.append('file', file);
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: cloudFlareForm,
    });
    if (response.status !== 200) return;
    const photoUrl = `https://imagedelivery.net/O9z9Gvg3_K_y87qLiKMdAA/${imageId}`;
    formData.set('photo', photoUrl);

    return uploadProduct(_, formData);
  };
  const [state, dispatch] = useActionState(preUploadImage, null);
  return (
    <div>
      <form action={dispatch} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex flex-col items-center justify-center text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer"
        >
          {preview ? (
            <Image
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
              width={100}
              height={100}
            />
          ) : (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
              </div>
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <FormInput
          name="title"
          placeholder="title"
          required
          errors={state?.fieldErrors?.title}
        />
        <FormInput
          name="price"
          placeholder="price"
          required
          errors={state?.fieldErrors?.price}
        />
        <FormInput
          name="description"
          placeholder="description"
          required
          errors={state?.fieldErrors?.description}
        />
        <FormButton text="추가하기" />
      </form>
    </div>
  );
}
