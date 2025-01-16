'use client';

import { FormButton } from '@/components/form-btn';
import { FormInput } from '@/components/form-input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { ChangeEvent, useActionState, useState } from 'react';
import { getUploadUrl, uploadProduct } from './actions';
import { ProductSchema, productSchema } from './schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function AddProduct() {
  const [preview, setPreview] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
  });
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
      setFile(file);
      const { success, result } = await getUploadUrl();
      if (success) {
        const { id, uploadURL } = result;
        setUploadUrl(uploadURL);
        setValue(
          'photo',
          `https://imagedelivery.net/O9z9Gvg3_K_y87qLiKMdAA/${id}`,
        );
      }
    }
  };
  const preUploadImage = handleSubmit(async (data: ProductSchema) => {
    if (!file) return;
    const cloudFlareForm = new FormData();
    cloudFlareForm.append('file', file);
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: cloudFlareForm,
    });
    if (response.status !== 200) return;
    const formData = new FormData();
    formData.append('photo', data.photo);
    formData.append('title', data.title);
    formData.append('price', data.price.toString());
    formData.append('description', data.description);

    return uploadProduct(formData);
  });
  const onValid = async () => {
    await preUploadImage();
  };

  return (
    <div>
      <form action={onValid} className="p-5 flex flex-col gap-5">
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
                {errors.photo?.message}
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
          {...register('title')}
          placeholder="title"
          required
          errors={[errors.title?.message ?? '']}
        />
        <FormInput
          {...register('price')}
          placeholder="price"
          required
          errors={[errors.price?.message ?? '']}
        />
        <FormInput
          {...register('description')}
          placeholder="description"
          required
          errors={[errors.description?.message ?? '']}
        />
        <FormButton text="추가하기" />
      </form>
    </div>
  );
}
