import { useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { CREATE_USER } from "../gqlQueries";

import '../css/login.scss'


import { Form, Field, ErrorMessage, Formik } from "formik";
import { useEffect } from "react";

export const Register = () =>  {
    
    const [register, { data }] = useMutation(CREATE_USER);
    const navigate = useNavigate();

    useEffect(()=>{
        
        if (data){
            navigate("/login")
        }

    }, [data])


    return <div className="container d-flex justify-content-center "> 
            <div className='login-window'>
                <div className='login-header'>
                    <h4>ByteMart</h4>
                </div>

                <Formik
                    initialValues={{ username: '', password: '', email:''}}
                    onSubmit={(values, { setSubmitting }) => {

                        register({ variables: { username: values.username, password: values.password, email:values.email} })
                        
                    }}
                    >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className='mb-3'>
                                <label class="form-label">Email</label>
                                <Field type="email" name="email" className="form-control"/>
                                <ErrorMessage name="email" component="div" />
                            </div>
                            <div className='mb-3'>
                                <label class="form-label">Username</label>
                                <Field type="text" name="username" className="form-control"/>
                                <ErrorMessage name="email" component="div"/>
                            </div>
                            <div className='mb-3'>
                            <label class="form-label">Password</label>
                                <Field type="password" name="password" className="form-control"/>
                                <ErrorMessage name="password" component="div" />
                            
                            </div>
                            <div className='login-btn'>
                                <button className='btn' type="submit" >Create Account</button>
                            </div>
                            
                            <Link to='/login'>Have an account?</Link>
                            
                        </Form>
                    )}
                    
                    
                </Formik>
            </div>
            
    </div>


    


}