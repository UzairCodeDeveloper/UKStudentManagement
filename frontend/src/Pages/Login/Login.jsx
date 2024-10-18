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
    const { username, password } = data; // Destructure the data for easier access
    
    // Regular expressions to check the format of user ID
    const isStudentID = /^\d{4}-\d{3}$/.test(username); // Format: 2024-102
    const isVolunteerID = /^\d{4}$/.test(username); // Format: 0003
    const isAdminID = /^[a-zA-Z]+$/.test(username); // Format: superAdmin
  
    if (isAdminID) {
      // Call Admin API
      AdminUserServices.signInAdmin(data)
        .then(response => {
          console.log(response.data);
          dispatch(setAdminUser(response.data));
        })
        .catch(error => {
          console.log(error);
          alert(error.response.data.errors[0].msg);
        });
    } else if (isStudentID) {
      // Call Student API
      console.log('Calling Student API'); // Replace with actual API call
      // Example:
      // StudentUserServices.signInStudent(data)
      //   .then(response => {
      //     console.log(response.data);
      //   })
      //   .catch(error => {
      //     console.log(error);
      //     alert(error.response.data.errors[0].msg);
      //   });
    } else if (isVolunteerID) {
      // Call Volunteer API
      console.log('Calling Volunteer API'); // Replace with actual API call
      // Example:
      // VolunteerUserServices.signInVolunteer(data)
      //   .then(response => {
      //     console.log(response.data);
      //   })
      //   .catch(error => {
      //     console.log(error);
      //     alert(error.response.data.errors[0].msg);
      //   });
    } else {
      alert('Invalid User ID format. Please enter a valid ID.');
    }
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
