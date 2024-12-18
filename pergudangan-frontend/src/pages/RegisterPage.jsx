// src/pages/RegisterPage.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Untuk navigasi setelah berhasil register
import { Button } from '@shadcn/ui/button';
import { Input } from '@shadcn/ui/input';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin'); // Default role adalah admin
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validasi input
        if (!username || !password) {
            setErrorMessage('Username dan password tidak boleh kosong.');
            return;
        }

        try {
            // Kirim permintaan register ke backend
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, role }),
            });

            const data = await response.json();

            if (response.ok) {
                // Jika register berhasil, arahkan ke login
                navigate('/login');
            } else {
                // Jika ada error, tampilkan pesan kesalahan
                setErrorMessage(data.message || 'Gagal mendaftar, coba lagi.');
            }
        } catch (error) {
            console.error('Register error:', error);
            setErrorMessage('Terjadi kesalahan, silakan coba lagi.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center">Register</h2>
                <form onSubmit={handleRegister} className="mt-6 space-y-4">
                    {errorMessage && (
                        <div className="text-red-500 text-center">{errorMessage}</div>
                    )}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium">
                            Username
                        </label>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-2 w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-2 w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium">
                            Role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-2 w-full border-2 rounded px-1 py-1"
                        >
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full mt-4 border-2 hover:bg-black hover:text-white hover:border-transparent "
                    >
                        Register
                    </Button>
                </form>
                <div className="text-center mt-4">
                    <p>
                        Sudah punya akun?{' '}
                        <a
                            href="/login"
                            className="text-blue-500 hover:underline"
                        >
                            Login di sini
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
