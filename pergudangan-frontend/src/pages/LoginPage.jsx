import { useState } from 'react';
import { Button } from '@shadcn/ui/button';
import { Input } from '@shadcn/ui/input';
import axios from 'axios';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setErrorMessage('Username dan password tidak boleh kosong.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                username,
                password,
            });

            const data = response.data;

            if (response.status === 200) {
                localStorage.setItem('token', data.token);
                window.location.reload();
            } else {
                setErrorMessage(data.message || 'Login gagal, coba lagi.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Terjadi kesalahan, silakan coba lagi.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center">Login</h2>
                <form onSubmit={handleLogin} className="mt-6 space-y-4">
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
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full mt-4 border-2 hover:bg-black hover:text-white hover:border-transparent "
                    >
                        Login
                    </Button>
                </form>
                <div className="text-center mt-4">
                    <p>
                        Belum punya akun?{' '}
                        <a
                            href="/register"
                            className="text-blue-500 hover:underline"
                        >
                            Daftar di sini
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;