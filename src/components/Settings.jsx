import React from 'react'
import { useForm } from 'react-hook-form';

const Settings = ({setShowSettings}) => {
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();

    const onSubmit = data => { 
        console.log(data);
    };


    return (
      <div className='w-full h-full border-[#464b5f] border-b-[1px] text-white flex flex-col'>

          <button className='w-full bg-[#282c37] p-3 flex items-center group' onClick={()=>setShowSettings(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z" clipRule="evenodd" />
              </svg>
              <span className='ml-3 group-hover:underline decoration-[#595aff] underline-offset-4'>Back</span>
          </button>

          <h1 className='pl-4 text-2xl'>Settings</h1>

          <div className=' flex flex-col w-full flex-grow overflow-y-scroll scrollbar:bg-blue-500 rounded-xl scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>

            <form className='flex flex-col justify-evenly items-center w-full h-full  px-3' onSubmit={handleSubmit(onSubmit)}>
                <label className='w-full flex flex-col pl-2'>
                    <span>Bio</span>
                    <span className='text-sm text-slate-400'>Desribe yourself!</span>
                </label>
                <textarea type='text' className='w-full h-1/5 p-3 bg-[#282c37] border-[#464b5f] border-[1px] rounded-xl outline-none resize-none' {...register('content', { required: 'Post text is required', minLength: { value: 1, message: 'Post text must be at least 1 character long' }, maxLength: { value: 160, message: 'Post text must be less than 160 characters long'}})}/>

                <label className='w-full flex flex-col pl-2'>
                    <span>Profile Picture</span>
                    <span className='text-sm text-slate-400'>2MB max size.</span>
                </label>
                  <input type='file' className='w-full pl-3' />

                <label className='w-full flex flex-col pl-2'>
                    <span>Profile Header</span>
                    <span className='text-sm text-slate-400'>2MB max size</span>
                </label>
                <input type='file' className='w-full pl-3' />

                <button className='w-1/2 py-2 bg-[#595aff] rounded-lg'>Save changes</button>

              </form>


          </div>

      </div>
    )
}

export default Settings