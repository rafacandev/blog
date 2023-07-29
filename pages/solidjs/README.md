SolidJS
=======


### Resource
```jsx
import { createSignal, createResource } from "solid-js";
import { render } from "solid-js/web";

const fetchUser = async (id) =>
  (await fetch(`https://swapi.dev/api/people/${id}/`)).json();

const App = () => {
  const [userId, setUserId] = createSignal();
  const [user] = createResource(userId, fetchUser);

  return (
    <>
      <input
        type="number"
        min="1"
        placeholder="Enter Numeric Id"
        onInput={(e) => setUserId(e.currentTarget.value)}
      />

      <span>{user.loading && "Loading..."}</span>

      <div>
        <pre>{JSON.stringify(user(), null, 2)}</pre>
      </div>
    </>
  );
};
```


CSS Libraries
=============

Tailwind CSS: 15 Component Libraries & UI Kits
https://stackdiary.com/tailwind-components-ui-kits/

daisyUI: adds component class names to Tailwind CSS; so you can make beautiful websites faster than ever.
https://daisyui.com/
