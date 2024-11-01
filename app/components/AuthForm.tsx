'use client';

import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "./Input/Input";
import Button from "./Button";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type variant = 'signin' | 'signup'
const AuthForm = () => {
    const session = useSession();
    const router = useRouter()
    const [variant, setVariant] = useState<variant>('signin')
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if(session?.status === 'authenticated'){
            router.push('/users')
        }
    },[session?.status,router])

    const toggleVariant = useCallback(()=>{
        if(variant === 'signin'){
            setVariant('signup')
        }
        else{
            setVariant('signin')
        }
    },[variant])

    const {
      register,
      handleSubmit,
      formState: { errors }
    } = useForm<FieldValues>({
        mode: 'onBlur',
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    })

    const onSubmit:SubmitHandler<FieldValues> = (data) => {
        setLoading(true)
        // console.log(data)
        if(variant === 'signup'){
            axios.post('/api/register', data)
            .then(()=> signIn('credentials', data))
            .catch(()=> toast.error('Something went wrong'))
            .finally(()=> setLoading(false))
        }
        if(variant === 'signin'){
            signIn('credentials',{
                ...data,
                redirect: false
            })
            .then((callback)=>{
                if(callback?.error){
                    toast.error('Invalid Credentials')
                }
                else if(callback?.ok){
                    toast.success('Logged In')
                    router.push('/users')
                }
            })
            .finally(()=> setLoading(false))
        }
    }

    const socialAction = (action : string) => {
        setLoading(true)
        signIn(action, {redirect: false})
        .then((callback)=>{
            if(callback?.error){
                toast.error('Invalid Credentials')
            }
            else if(callback?.ok){
                toast.success('Logged In')
            }
        })
        .finally(()=> setLoading(false))
    }
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {variant === 'signup' && (
                    <Input id="name" label="Name" register={register} errors={errors} disabled={loading} />
                    )}
                <Input id="email" label="Email Adress" type="email" register={register} errors={errors} disabled={loading}/>
                <Input id="password" label="Password" type="password" register={register} errors={errors} disabled={loading}/>
                <div>
                    <Button
                    disabled={loading}
                    type="submit"
                    fullWidth
                    >
                        {variant === 'signin' ? 'Sign In' : 'Sign Up'}
                    </Button>
                </div>
            </form>
            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"/>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">
                            Or continue with    
                        </span>
                    </div>
                </div>
                <div className="mt-6 flex gap-2">
                    <AuthSocialButton icon={BsGithub} onClick={()=> socialAction('github')}/>
                    <AuthSocialButton icon={BsGoogle} onClick={()=> socialAction('google')}/>
                </div>
            </div>
            <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                <div>
                    {variant === 'signin' ? 'New to us?' : 'Already have an account?'}
                </div>
                <div onClick={toggleVariant} className="underline cursor-pointer">
                    {variant === 'signin' ? 'Create An Account' : 'Login'}
                </div>
            </div>
        </div>
    </div>
  )
}

export default AuthForm