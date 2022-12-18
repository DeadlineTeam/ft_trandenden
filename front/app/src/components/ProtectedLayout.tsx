export default function ProtectedLayout({ body }: { body: React.ReactNode }) {
    const pageName = window.location.pathname.split("/")[1];
    const pages = [
      "",
  ];
  
  if (pages.includes(pageName)) 
      return <>
      </>;
    else 
      return <>
      {body}
      </>
  
  }