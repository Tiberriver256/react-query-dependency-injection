import { useContext } from 'react';
import { MyServiceContext } from '..';

export function Page1() {
  const myService = useContext(MyServiceContext);
  return (
    <div>
      <h2>Page 1</h2>
      <p>Dependency injection magic: {myService && myService()}</p>
    </div>
  );
}
