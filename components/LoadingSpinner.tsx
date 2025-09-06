// components/LoadingSpinner.tsx - Component loading spinner có thể tái sử dụng
interface LoadingSpinnerProps {
  message?: string;
  show?: boolean;
}

const LoadingSpinner = ({ message = "Đợi tí nha, đang tải ảnh nè ;)", show = true }: LoadingSpinnerProps) => {
  if (!show) return null;

  return (
    <div 
      id="gallery-loading" 
      style={{ 
        textAlign: 'center', 
        margin: '50px 0',
        opacity: show ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    >
      <div className="spinner"></div>
      <p style={{ 
        marginTop: '15px', 
        fontSize: '16px', 
        color: '#555',
        animation: 'fadeIn 0.5s ease-in'
      }}>
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;