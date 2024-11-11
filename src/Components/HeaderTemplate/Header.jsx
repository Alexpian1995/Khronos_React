import { useContext } from 'react'
import './Header.css'
import { ThemeContext } from '../../ThemeContext'

import { BiSearch } from 'react-icons/bi'
import { AiOutlineUser } from 'react-icons/ai'
import { TbMessages } from 'react-icons/tb'
import { IoAnalytics } from 'react-icons/io5'
import { HiOutlineLogout, HiOutlineMoon } from 'react-icons/hi'
import { RiSettingsLine } from 'react-icons/ri'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'



const Header = () => {

    const {DarkTheme, setDarkTheme} = useContext(ThemeContext)

    function changeTheme() {
        setDarkTheme(!DarkTheme);
    }

    const logout = ( )=>{
        signOut(auth)
    }

  return <header className={` ${DarkTheme && "dark"}`}>
    <div className="search-bar">
        <input type="text"  placeholder='search...'/>
        <BiSearch  className='icon' />
    </div>
  
   <div className="tools">
    <AiOutlineUser className='icon' />
    <TbMessages className='icon' />
    <IoAnalytics className='icon' />

    <div className='divider'></div>

    <HiOutlineMoon className='icon' onClick={changeTheme}/>
    <RiSettingsLine className='icon' />
    <HiOutlineLogout className='icon' onClick={logout} />

    <div className="divider"></div>

    <div className="user">
        <img src="https://images.unsplash.com/photo-1588534331122-77ac46322dd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dXNlciUyMGFkbWlufGVufDB8fDB8fHww" alt="" className="profile-img" />
    </div>

    
   </div>
   </header>
      
  
}

export default Header
