export default async function Dashboard({ params }) {
    const { id } = await params;
    console.log("id: ", id);
    return (
        <>
            <div>page</div>
        </>
  )
}
