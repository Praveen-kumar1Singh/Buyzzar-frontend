import React, { useContext, useEffect, useRef, useState } from 'react';
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { HiMenuAlt3 } from "react-icons/hi";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import { motion, useScroll, useAnimation } from 'framer-motion';

const Header = () => {
  const user = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);
  const { scrollY } = useScroll();
  const controls = useAnimation();
  const profileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    return scrollY.onChange((y) => {
      controls.start({ y: y > 50 ? -100 : 0 });
    });
  }, [scrollY, controls]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setMenuDisplay(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include',
    });
    const data = await fetchData.json();
    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate('/');
    } else if (data.error) {
      toast.error(data.message);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    navigate(value ? `/search?q=${value}` : "/search");
  };

  return (
    <motion.header
      className='h-[85px] shadow-sm bg-white fixed w-full z-40 transition-all duration-100 font-[Poppins]'
      animate={controls}
      initial={{ y: 0 }}
    >
      <div className='h-full container mx-auto flex items-center justify-between px-9'>
        <Link to="/" className='flex items-center gap-2'>
          <img
            src="/logoforappwhite.svg"
            alt="Logo"
            className="w-28 h-auto sm:w-32 md:w-36 lg:w-44"
          />
        </Link>

        <div className='hidden lg:flex items-center w-full max-w-md border rounded-full shadow-sm pl-4'>
          <input
            type='text'
            placeholder='Search your style...'
            className='w-full px-2 py-2 outline-none text-sm text-gray-700'
            onChange={handleSearch}
            value={search}
          />
          <button className='bg-black hover:bg-red-700 text-white px-4 py-3 rounded-r-full'>
            <GrSearch />
          </button>
        </div>

        <div className='flex items-center gap-4'>
          {user?._id && (
            <Link to='/cart' className='text-2xl relative text-gray-700 hover:text-red-600'>
              <FaShoppingCart />
              <span className='bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs absolute -top-2 -right-3'>
                {context?.cartProductCount}
              </span>
            </Link>
          )}

          {/* Hamburger Toggle */}
          <button
            className='lg:hidden text-3xl text-gray-700 z-50'
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenu(prev => !prev);
            }}
          >
            <HiMenuAlt3 />
          </button>

          {user?._id ? (
            <div className='hidden lg:block relative' ref={profileDropdownRef}>
              <div
                className='text-3xl cursor-pointer relative'
                onClick={() => setMenuDisplay(prev => !prev)}
              >
                {user?.profilePic ? (
                  <img src={user?.profilePic} className='w-10 h-10 rounded-full object-cover border border-gray-300' alt={user?.name} />
                ) : (
                  <FaRegCircleUser />
                )}
              </div>

              {menuDisplay && (
                <div className='absolute bg-white top-12 right-0 p-4 shadow-xl rounded-lg w-56 z-50 flex flex-col gap-2 text-sm'>
                  <p className='font-semibold text-gray-800 border-b pb-2'>
                    Hello, <span className="text-gray-800 uppercase">{user.name}</span>
                  </p>

                  {user?.role === ROLE.ADMIN && (
                    <Link to='/admin-panel/all-products' className='hover:bg-gray-100 px-3 py-2 rounded text-gray-700'>
                      Admin Panel
                    </Link>
                  )}

                  <Link to='/my-orders' className='hover:bg-gray-100 px-3 py-2 rounded text-gray-700'>
                    My Orders
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuDisplay(false);
                    }}
                    className='bg-black text-white px-4 py-2 rounded-full hover:bg-red-700 transition-all'
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden lg:inline-block text-sm font-medium px-7 py-2 bg-black text-white rounded-md hover:bg-red-700 transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenu && (
        <div className='lg:hidden bg-white w-full shadow-md p-4 absolute z-40 flex flex-col gap-3' ref={mobileMenuRef}>
          {user?._id ? (
            <>
              <p className='font-semibold text-gray-800 border-b pb-2'>
                Hello, <span className="text-gray-800 uppercase">{user.name}</span>
              </p>

              <Link to='/my-orders' onClick={() => setMobileMenu(false)} className='hover:bg-gray-100 px-3 py-2 rounded text-gray-700'>
                My Orders
              </Link>

              <div className='flex items-center w-full border rounded-full shadow-sm pl-4'>
                <input
                  type='text'
                  placeholder='Search your style...'
                  className='w-full px-2 py-2 outline-none text-sm text-gray-700'
                  onChange={handleSearch}
                  value={search}
                />
                <button className='bg-black hover:bg-red-700 text-white px-4 py-3 rounded-r-full'>
                  <GrSearch />
                </button>
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenu(false);
                }}
                className='bg-black text-white px-4 py-2 rounded-full hover:bg-red-700 transition-all'
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenu(false)}
              className="bg-black text-white px-5 py-2 rounded-md hover:bg-red-700 transition-all text-center"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </motion.header>
  );
};

export default Header;
