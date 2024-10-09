import { useForm } from 'react-hook-form'; // Import useForm from react-hook-form
import './login.css';
import logo from '../../assets/logo.webp';
import animation from './loginAnimation.json';
import Lottie from 'lottie-react';
import AdminUserServices from "../../api/services/admin/adminUser"
import { useDispatch } from 'react-redux';
import { setAdminUser } from '../../Redux/userSlice';

export default function Login() {

  const { register, handleSubmit, formState: { errors } } = useForm(); // Initialize useForm

  const dispatch = useDispatch();
  
  const onSubmit = (data) => {
    
    // console.log(JSON.stringify(data)); 
    AdminUserServices.signInAdmin(data)
    .then(response => {
      console.log(response.data)
      // Loading Element should be added here
      dispatch(setAdminUser(response.data));
    })
    .catch(error => {
      console.log(error)
      alert(error.response.data.errors[0].msg)
    })

    
  };

  return (
    <div className='container-fluid loginContainer'>
      <div className='loginBoxWrapper'>
        <div className='loginFormContainer'>
          <img src={logo} alt='companyLogo' className='loginLogo' />
          <h4>Welcome Back</h4>
          
         
          <form className='loginForm' onSubmit={handleSubmit(onSubmit)}>
            <div className='form-group'>
              <label htmlFor='username'>ID</label>
              
              <input 
                type='text' 
                id='username' 
                placeholder='Enter your ID' 
                {...register('username', { required: 'Username is required' })} // Update validation for ID
              />
              
              {errors.id && <span className='error'>{errors.id.message}</span>}
            </div>
            
            <div className='form-group' style={{marginTop:"10px"}}>
              <label htmlFor='password'>Password</label>
              
              <input 
                type='password' 
                id='password' 
                placeholder='Enter your password' 
                {...register('password', { required: 'Password is required' })} // Keep password validation
              />
              
              {errors.password && <span className='error'>{errors.password.message}</span>}
            </div>
            
            <div className='forgotPassword'>
              <a href='/forgot-password'>Forgot password?</a>
            </div>
            
            <button type='submit' className='loginBtn'>Login</button>
          </form>
        </div>
        
        <div className='loginAvatarContainer'>
          <Lottie animationData={animation} loop={true} />
        </div>
      </div>
    </div>
  );
}
