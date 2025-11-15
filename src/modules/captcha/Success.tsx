interface SuccessProps {}

const Success: React.FC<SuccessProps> = () => {
  return (
    <div className="text-center p-8 bg-gray-800 rounded-lg shadow-2xl">
      <h2 className="text-4xl font-bold text-green-400 mb-4">
        Validation Successful!
      </h2>
      <p className="text-lg text-gray-300">
        You have proven you are a human. Welcome!
      </p>
    </div>
  );
};

export default Success;
