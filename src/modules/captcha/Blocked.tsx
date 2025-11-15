interface BlockedProps {}

const Blocked: React.FC<BlockedProps> = () => {
  return (
    <div className="text-center p-8 bg-gray-800 rounded-lg shadow-2xl">
      <h2 className="text-4xl font-bold text-red-500 mb-4">
        Too many failed attempts
      </h2>
      <p className="text-lg text-gray-300">
        You have been blocked. Please try again later.
      </p>
    </div>
  );
};

export default Blocked;
