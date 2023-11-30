
import React from 'react';

interface ModelInterfacePageProps {
}

const ModelInterfacePage: React.FC<ModelInterfacePageProps> = ({ }) => {
  return (
    <>
      <div className="px-36">
        <p>Welcome to the model interface!</p>
        <div className="input-container">
          <label className="block text-sm font-bold mb-2" htmlFor="username">
            Username:
          </label>
          <input
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
          />
        </div>
      </div>
    </>
  );
}

export default ModelInterfacePage;