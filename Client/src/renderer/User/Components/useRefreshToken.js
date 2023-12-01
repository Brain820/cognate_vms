import axios from "axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const {setAuth} = useAuth();

  const refresh = async () => {
    const response = await axios.get('/getrefreshToken', {
      withCredentials: true,
    });
    setAuth(prev => {
      return {...prev, access_token: response.access_token};
    });
    return response.access_token;
  }

  return (
    <div>

    </div>
  )
}

export default useRefreshToken
