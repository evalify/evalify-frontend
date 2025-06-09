interface ManageQuizPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ManageQuizPage({ params }: ManageQuizPageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Quiz</h1>
      <p>Quiz ID: {id}</p>
      {/* Add your quiz management content here */}
    </div>
  );
}
