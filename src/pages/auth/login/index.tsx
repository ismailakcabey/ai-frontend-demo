import { Form, notification } from 'antd';
import './index.scss'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/auth.store';
import { useLogin } from '../../../apis/services/auth';
const LoginPage = () => {
    const navigate = useNavigate()
    const loginMutation = useLogin();
    const { setAccessToken, setRefreshToken, setUser } = useAuthStore()
    const onFinish = async (values: any) => {
        const result = await loginMutation.mutateAsync(values);
        console.log(result, 'verisi burada')
        if (result?.loginStatus) {
            setAccessToken(result?.token)
            setRefreshToken(result?.token)
            console.log(result?.data, 'user a ataniyor')
            setUser(result?.data)
            notification.success({
                message: 'Login Successfully',
                description: 'login information',
            })
            navigate('/')
        }
        else {
            notification.error({
                message: `Login Failed`,
                description: 'Incorrect login information',
            })
        }
        console.log('Success:', values);
    };
    return (
        <>
            <div className='flex md:flex-row justify-between  h-screen items-center'>
                <div className='w-full flex flex-col  justify-center items-center'>
                    <div style={{
                        color: "#232323",
                        fontFamily: "sans-serif",
                        fontSize: "40px",
                        textAlign: "start",
                        fontWeight: "700",
                        lineHeight: "110%",
                        letterSpacing: "-1.6px"
                    }}>Sign In</div>
                    <div
                        style={{
                            color: "#969696",
                            fontFamily: "sans-serif",
                            fontSize: "18px",
                            textAlign: "start",
                            fontWeight: "400",
                            lineHeight: "150%",
                        }}
                    >Please login to continue to your account.</div>
                    <div>
                        <Form
                            name='loginForm'
                            onFinish={onFinish}
                            autoComplete='off'
                        >
                            <Form.Item
                                name="email"
                            >
                                <div className="w-[400px]  max-md:w-[350px]">
                                    <input
                                        type="text"
                                        id="small_outlined"
                                        className="border-[1px] peer block w-full appearance-none rounded-lg border-black  px-2.5 pb-1.5 pt-3 text-sm text-black focus:border-[#367AFF] focus:outline-none focus:ring-0 dark:border-[#367AFF] dark:text-black dark:focus:border-[#367AFF]"
                                        placeholder=" "
                                    />
                                    <label
                                        className="start-1 text-normal bg-red absolute top-1 z-10 origin-[0] -translate-y-3 scale-75 transform px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-black rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-black peer-focus:dark:text-black"
                                    >
                                        Email
                                    </label>
                                </div>
                            </Form.Item>
                            <Form.Item
                                name="password"
                            >
                                <div className="w-[400px]  max-md:w-[350px]">
                                    <input
                                        type="password"
                                        id="small_outlined"
                                        className="border-[1px] peer block w-full appearance-none rounded-lg border-black  px-2.5 pb-1.5 pt-3 text-sm text-black focus:border-[#367AFF] focus:outline-none focus:ring-0 dark:border-[#367AFF] dark:text-black dark:focus:border-[#367AFF]"
                                        placeholder=" "
                                    />
                                    <label
                                        className="start-1 text-normal bg-red absolute top-1 z-10 origin-[0] -translate-y-3 scale-75 transform px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-black rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-black peer-focus:dark:text-black"
                                    >
                                        Password
                                    </label>
                                </div>
                            </Form.Item>
                            <div className='flex flex-row justify-between'>
                                <Form.Item
                                >
                                    <div className='flex flex-row justify-center items-center'>
                                        <input className='mr-2' type='checkbox' />
                                        <span>Keep me logged in </span>

                                    </div>
                                </Form.Item>
                            </div>
                            <Form.Item>
                                <button
                                    className='w-[400px] max-md:w-[350px] bg-[#367AFF]'
                                    style={{
                                        borderRadius: "10px",
                                        display: 'flex',
                                        padding: "16px 8px",
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: "8px"
                                    }}
                                ><span style={{
                                    color: "#FFF",
                                    fontFamily: "sans-serif",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    lineHeight: "120%"
                                }}>
                                        Sign In
                                    </span></button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                <div className='flex max-md:hidden flex-col justify-center items-center mr-5 ml-2 w-full'><img src="../../../../src/assets/container.png" alt="" /></div>
            </div>
        </>
    )
}

export default LoginPage