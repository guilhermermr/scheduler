export default function PublicProfilePage({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Perfil Público de: {params.slug}</h1>
            <p>Esta página será a agenda que o cliente vai ver.</p>
        </div>
    );
}