export default function Footer() {
  return (
    <footer className="bg-gray-50 py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">AI</div>
              <span className="font-bold text-gray-900">AI English Learning</span>
            </div>
            <p className="text-gray-500 text-sm">Học tiếng Anh hiệu quả hơn với sức mạnh của trí tuệ nhân tạo.</p>
          </div>
          
          <FooterColumn title="Sản phẩm" links={['Features', 'Pricing', 'Demo']} />
          <FooterColumn title="Công ty" links={['About Us', 'Blog', 'Careers']} />
          <FooterColumn title="Pháp lý" links={['Terms of Service', 'Privacy Policy']} />
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-gray-500">
          © 2025 AI English Learning. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">{title}</h4>
      <ul className="space-y-3 text-sm text-gray-600">
        {links.map((link) => (
          <li key={link}><a href="#" className="hover:text-blue-600">{link}</a></li>
        ))}
      </ul>
    </div>
  );
}