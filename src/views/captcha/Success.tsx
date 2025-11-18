import { CheckCheck } from 'lucide-react';

interface SuccessProps {}

const Success: React.FC<SuccessProps> = () => {
  return (
    <div className="text-center p-8 rounded-lg ">
      <CheckCheck size={80} className="mx-auto text-green-400" />
      <h2 className="text-4xl font-bold text-green-400 mb-4">
        Validation Successful!
      </h2>
      <p className="text-lg ">You have proven you are a human. Welcome!</p>
    </div>
  );
};

export default Success;
