import axios from 'axios';

const fetchData = async () => {
  try {
    const response = await axios.get('https://rickandmortyapi.com/api/character');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('An error occurred while fetching data.');
  }
};

export default fetchData;