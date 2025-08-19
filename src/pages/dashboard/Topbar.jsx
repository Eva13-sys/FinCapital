import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

import md5 from "md5";


const Topbar = () => {
    const [greeting, setGreeting] = useState('');
    const [user, setUser] = useState(null);

    //dummy data
    // const level = 4;
    // const xp = 80;
    // const total = 100;
    // const xpPercent = (xp / total) * 100
    // ;
    const [level, setLevel] = useState(1);
    const [xp, setXp] = useState(0);
    const total = 100;
    const xpPercent = (xp / total) * 100;


    useEffect(() => {
        const hour = new Date().getHours();
        let greet = "Welcome";
        if (hour < 12) {
            greet = "Good Morning";
        }
        else if (hour < 18) greet = "Good Afternoon";
        else greet = "Good Evening";
        setGreeting(`${greet}, User!`);;
    }, []);

    //user from firebase
    // useEffect(() => {
    //     const auth = getAuth();
    //     const currentUser = auth.currentUser;
    //     if (currentUser) {
    //         setUser({
    //             name: currentUser.displayName || 'User',
    //             email: currentUser.email,
    //             avatar: `https://www.gravatar.com/avatar/${md5(currentUser.email.trim().toLowerCase())}?d=identicon`
    //         });
    //     }
    // }, []);
    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            setUser({
                name: currentUser.displayName || 'User',
                email: currentUser.email,
                avatar: `https://www.gravatar.com/avatar/${md5(currentUser.email.trim().toLowerCase())}?d=identicon`
            });

            // Firestore fetch
            const fetchUserData = async () => {
                const db = getFirestore();
                const userRef = doc(db, 'users', currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setLevel(data.level || 1);
                    setXp(data.xp || 0);
                } else {
                    console.log('No XP data found for user.');
                }
            };

            fetchUserData();
        }
    }, []);




    return (
        <div className='bg-white p-4 shadow-md rounded-md flex justify-between items-center'>
            <div>
                <h1 className='text-xl font-semibold'>{greeting}, {user?.name || 'User'}</h1>
                <div className='text-sm text-gray-600 mb-1'>Level {level}-XP: {xp}/{total}</div>
                <div className='w-full bg-gray-200 rounded-full h-3'>
                    <div className={`h-full rounded-full transition-all duration-500 ${xpPercent < 50 ? "bg-red-400"
                        : xpPercent < 80 ? "bg-yellow-400"
                            : "bg-green-400"
                        }`} style={{ width: `${xpPercent}%` }}></div>
                </div>
            </div>
            {user && (
                <div className='flex items-center gap-4'>
                    <img src={user.avatar}
                        alt="User Avatar" className="w-10 h-10 rounded-full" />
                </div>
            )}

        </div>

    );
};

export default Topbar;
