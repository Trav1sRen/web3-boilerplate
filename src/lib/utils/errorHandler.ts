import axios from 'axios';

export default function errorHandler(error: Error) {
  if (axios.isAxiosError(error)) {
  }
}
