import React, { useState } from 'react'
import { set, useForm } from 'react-hook-form'

import { createPost } from '../api/postAPI';


function PostForm() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [formError, setFormError] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async(data) => {
      setLoading(true);

      const formData = new URLSearchParams();

      formData.set('content', data.content);
          
        createPost(formData)
          .then(res => {
            if (res.status === 'fail') {
              console.log(res)
              setFormError(res.data.content);
            }
          })
          .catch(err => setFormError('Could not proccess your request. Try again later.'))
          .finally(()=> setLoading(false));
    }

    return (
    <form onSubmit={handleSubmit(onSubmit)}>
        {formError && <div className='py-px text-sm text-red-500'>{formError}</div>}
        <label htmlFor="content">Post Text</label>
        <input type="text" placeholder='Share your thoughts!' {...register('content', { required: 'Post text is required', minLength: { value: 1, message: 'Post text must be at least 1 character long' }, maxLength: { value: 1000, message: 'Post text must be less than 1000 characters long' } })} />
        {errors?.content && <div className='py-px text-sm text-red-500'>{errors.content.message}</div>}
        <button type='submit'>Share</button>
    </form>
  )
}

export default PostForm;