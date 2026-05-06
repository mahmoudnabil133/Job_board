import { useParams, useSearchParams } from 'react-router'

const Login = () => {
    const {id} = useParams();
    const [searchParam] = useSearchParams()
  return (
    <div>
      <p>id is : {id}</p>
      <p>
      param : {searchParam.get("name")}
      </p>
    </div>
  );
}

export default Login
