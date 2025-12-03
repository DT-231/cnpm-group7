import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import hook chuyển trang
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SignUp = () => {
  const navigate = useNavigate(); // 2. Khởi tạo hook
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => { // Chuyển thành async function
    e.preventDefault();

    // Validate mật khẩu
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu và Xác nhận mật khẩu không khớp!');
      return;
    }

    setLoading(true); // Bắt đầu loading

    // Chuẩn bị dữ liệu (Backend hiện tại chỉ nhận username, email, password)
    const dataToSend = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    try {
      // 3. Gọi API thực tế
      // Đảm bảo URL này đúng với backend của bạn (mặc định là http://localhost:8000)
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
        navigate('/login'); // 4. Chuyển hướng về trang Login
      } else {
        const errorData = await response.json();
        alert(`Đăng ký thất bại: ${errorData.detail || 'Lỗi hệ thống'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Không thể kết nối đến server. Hãy chắc chắn Backend đang chạy.');
    } finally {
      setLoading(false); // Tắt loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-blue-600 -mt-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Đăng Ký Tài Khoản</CardTitle>
          <CardDescription className="text-center text-zinc-600">
            Bắt đầu học tiếng Anh thông minh với AI ngay hôm nay.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="username">Tên người dùng</Label>
              <Input id="username" name="username" type="text" placeholder="Tên đăng nhập" required onChange={handleChange}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullname">Họ và tên</Label>
              <Input id="fullname" name="fullname" type="text" placeholder="Nhập họ và tên" required onChange={handleChange}/>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Địa chỉ Email</Label>
              <Input id="email" name="email" type="email" placeholder="email@example.com" required onChange={handleChange}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" name="password" type="password" placeholder="Mật khẩu" required onChange={handleChange}/>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Nhập lại mật khẩu" required onChange={handleChange}/>
            </div>

            {/* Nút Submit có thêm trạng thái Loading */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 font-semibold shadow-md shadow-blue-600/20 mt-6"
            >
              {loading ? 'Đang xử lý...' : 'Tạo Tài Khoản'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-zinc-500">
              Đã có tài khoản?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Đăng Nhập
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;