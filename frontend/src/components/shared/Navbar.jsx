import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, Menu, User2, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { useState } from 'react'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    return (
        <div className='bg-white'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 md:px-6'>
                <div className='flex items-center justify-between w-full px-4'>
                    <h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1>
                    <div className="md:hidden">
                        <button onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
                <div className='hidden md:flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies">Companies</Link></li>
                                    <li><Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/jobs">Jobs</Link></li>
                                    <li><Link to="/browse">Browse</Link></li>
                                </>
                            )
                        }


                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button variant="outline">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className=''>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.fullname}</h4>
                                                <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            {
                                                user && user.role === 'student' && (
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                        <User2 />
                                                        <Button variant="link"> <Link to="/profile">View Profile</Link></Button>
                                                    </div>
                                                )
                                            }

                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant="link">Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }

                </div>
            </div>
            {menuOpen && (
                <div className='md:hidden px-4 py-2 bg-white border-t'>
                    <ul className='flex flex-col gap-4 font-medium'>
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li><Link to="/admin/companies" onClick={() => setMenuOpen(false)}>Companies</Link></li>
                                <li><Link to="/admin/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                                <li><Link to="/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link></li>
                                <li><Link to="/browse" onClick={() => setMenuOpen(false)}>Browse</Link></li>
                            </>
                        )}
                    </ul>

                    {!user ? (
                        <div className='flex flex-col gap-2 mt-4'>
                            <Link to="/login"><Button variant="outline" className='w-full'>Login</Button></Link>
                            <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6] w-full">Signup</Button></Link>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-2 mt-4 text-gray-600'>
                            {user.role === 'student' && (
                                <div className='flex items-center gap-2'>
                                    <User2 />
                                    <Link to="/profile" onClick={() => setMenuOpen(false)}><Button variant="link">View Profile</Button></Link>
                                </div>
                            )}
                            <div className='flex items-center gap-2'>
                                <LogOut />
                                <Button onClick={() => { logoutHandler(); setMenuOpen(false); }} variant="link">Logout</Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    )
}

export default Navbar