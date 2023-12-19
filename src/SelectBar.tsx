import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import fetchData from './services';

interface Option {
  value: string;
  label: string;
  image: string;
  totalEpisodes: number;
}

const MultiSelect: React.FC = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      try {
        const data = await fetchData();
        const formattedOptions: Option[] = data.map((item: any) => ({
          value: item.id.toString(),
          label: item.name,
          image: item.image,
          totalEpisodes: item.episode.length,
        }));
        setOptions(formattedOptions);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDataAndSetState();
  }, []);

  const removeOption = (valueToRemove: string) => {
    const updatedOptions = selectedOptions.filter((option) => option.value !== valueToRemove);
    setSelectedOptions(updatedOptions);
  };

  const MultiValueContainer: React.FC<any> = (props) => (
    <components.MultiValueContainer {...props}>
      {props.children}
    </components.MultiValueContainer>
  );

  const CustomOption: React.FC<any> = ({ innerProps, label, data, selectProps, isFocused }) => {
    const inputValue = selectProps?.inputValue || '';

    const makeLabelBold = () => {
      if (inputValue && label.toLowerCase().includes(inputValue.toLowerCase())) {
        const index = label.toLowerCase().indexOf(inputValue.toLowerCase());
        const start = label.substring(0, index);
        const bold = label.substring(index, index + inputValue.length);
        const end = label.substring(index + inputValue.length);
        return (
          <span>
            {start}
            <span style={{ fontWeight: 'bold' }}>{bold}</span>
            {end}
          </span>
        );
      }
      return label;
    };

    return (
      <div
        {...innerProps}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px',
          backgroundColor: isFocused ? '#e0e0e0' : 'transparent',
          borderBottom: '1px solid #ccc', 
        }}
        
      >
        
        <div
          style={{
            width: '16px',
            height: '16px',
            border: '1px solid #aaa',
            borderRadius: '3px',
            marginRight: '10px',
            backgroundColor: selectedOptions.some((option) => option.value === data.value)
              ? '#2986cc'
              : 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={() => removeOption(data.value)}
        >
          {selectedOptions.some((option) => option.value === data.value) && (
            <span style={{ color: 'white' }}>✔</span>
          )}
        </div>
        <img src={data.image} alt={label} style={{ width: '30px', marginRight: '10px' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{makeLabelBold()}</span>
          <span style={{ color: '#888' }}>{`Episode: ${data.totalEpisodes}`}</span>
        </div>
      </div>
    );
  };

  const DropdownIndicator: React.FC<any> = (props) => (
    components.DropdownIndicator && <components.DropdownIndicator {...props}></components.DropdownIndicator>
  );

  const Menu: React.FC<any> = (props) => (
    <components.Menu {...props}>
      {selectedOptions.map((option, index) => (
        <React.Fragment key={option.value}>
         
          <CustomOption label={option.label} data={option} innerProps={{}} />
        </React.Fragment>
      ))}
      {props.children}
    </components.Menu>
  );

  const handleChange = (selectedOption: Option[]) => {
    setSelectedOptions(selectedOption);
  };

  

  return (
    <div style={{ width: '400px', margin: 'auto', marginTop: '20px' }}>
    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p>Error: {error}</p>
    ) : (
      <Select
        options={options}
        value={selectedOptions}
        isMulti
        components={{
          MultiValueContainer,
          Option: CustomOption,
          DropdownIndicator,
          Menu,
        }}
        onChange={handleChange}
        closeMenuOnSelect={false}
      />
    )}
  </div>
  );
};

export default MultiSelect;
