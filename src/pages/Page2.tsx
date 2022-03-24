import { useContext } from 'react';
import { MyServiceContext } from '..';

export function Page2() {
  const myService = useContext(MyServiceContext);
  return (
    <div>
      <h2>Page 2</h2>
      <p>Dependency injection magic: {myService && myService()}</p>
    </div>
  );
  }
  