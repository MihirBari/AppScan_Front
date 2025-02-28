import React, { useState, useEffect } from "react";

const Datalist = ({ id, options, onSelect, placeholder, value }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setInputValue(inputValue);
  };


 const handleOptionClick = (selectedValue) => {
  const selectedProduct = options.find((option) => option.id === selectedValue);
  setInputValue(selectedProduct.id); 
  console.log(setInputValue)
  onSelect(selectedProduct);
}

  return (
    <div className="mt-1 relative">
      <input
        type="text"
        list={id}
        onChange={handleInputChange}
        placeholder={placeholder}
        value={inputValue}
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
      <datalist id={id}>
        {filteredOptions.map((option) => (
          <option
            key={option}
            value={option}
            onClick={() => handleOptionClick(option)}
          />
        ))}
      </datalist>
    </div>
  );
};

export default Datalist;
