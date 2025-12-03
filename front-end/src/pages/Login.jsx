import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'; // Đã định nghĩa trong .env.example

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    // TODO: Triển khai logic gọi API đăng nhập tại đây (POST tới /api/token hoặc /api/login)
    const fakeUser = { username: formData.username, avatar: "https://ui-avatars.com/api/?name=" + formData.username };
    localStorage.setItem('user', JSON.stringify(fakeUser));
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-blue-600 -mt-20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Đăng Nhập</CardTitle>
          <CardDescription className="text-center text-zinc-600">
            Chào mừng bạn quay lại AI English Learning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Tên người dùng</Label>
              <Input 
                id="username" 
                name="username" 
                type="text" 
                placeholder="Nhập tên người dùng" 
                required
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="Nhập mật khẩu" 
                required
                onChange={handleChange}
              />
            </div>
            {/* Nút Đăng Nhập */}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 font-semibold shadow-md shadow-blue-600/20"
            >
              Đăng Nhập
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-zinc-500">
              Chưa có tài khoản?{' '}
              <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Đăng ký ngay
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    
  );
  
};

export default Login;