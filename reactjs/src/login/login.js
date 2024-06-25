
import '../css/login.scss'

import { Formik, Form, Field, ErrorMessage} from 'formik';

// import { LOGIN_USER } from '../gqlQueries';

import { LOGIN_USER } from '../gql/mutations';

import { useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { useCookies } from 'react-cookie';



export const Login = () =>  {
    
    const [login, { data, error}] = useMutation(LOGIN_USER);
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['user']);
    

    useEffect(()=>{
        
        if (data){
            if (cookies.user){
                navigate("/logout")
            }

            setCookie('user', data.loginUser.user);
            navigate("/")
        }

    }, [data, setCookie, navigate, cookies])


    return <div className=" container d-flex justify-content-center "> 
            <div className='login-window'>
                <div className='login-header'>
                    <h4>ByteMart</h4>
                </div>

                <Formik
                    initialValues={{ username: '', password: '' }}
                    onSubmit={(values, { setSubmitting }) => {

                        login({ variables: { username: values.username, password: values.password } })
                        
                    }}
                    >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className='mb-3'>
                                <label for="exampleFormControlInput1" class="form-label">Username</label>
                                <Field type="text" name="username" className="form-control"/>
                                <ErrorMessage name="email" component="div"/>
                            </div>
                            <div className='mb-3'>
                            <label for="exampleFormControlInput2" class="form-label">Password</label>
                                <Field type="password" name="password" className="form-control"/>
                                <ErrorMessage name="password" component="div" />
                            </div>
                            <div className='login-btn'>
                                <p>{error && error.message}</p>
                                <button className='btn' type="submit" disabled={isSubmitting}>Log in</button>
                            </div>
                            <Link to='/register'>No Account?</Link>
                            
                            
                        </Form>
                    )}
                    
                    
                </Formik>
            </div>
            
    </div>


    


}