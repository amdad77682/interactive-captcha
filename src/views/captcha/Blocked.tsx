import { TriangleAlert } from 'lucide-react';

interface BlockedProps {}

const Blocked: React.FC<BlockedProps> = () => {
  return (
    <div className="text-center p-8">
      <TriangleAlert size={80} className="mx-auto mb-2 text-red-400 " />

      <h2 className="text-4xl font-bold text-red-500 mb-4">
        Too many failed attempts
      </h2>
      <p className="text-lg ">You have been blocked. Please try again later.</p>
    </div>
  );
};

export default Blocked;
