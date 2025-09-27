import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [task, setTask] = useState('');
  const [output, setOutput] = useState('');
  const [framework, setFramework] = useState('SMART Goals');
  const [technique, setTechnique] = useState('Pomodoro Technique');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const frameworkOptions = [
    "SMART Goals", "Work Breakdown Structure (WBS)", "The 5 Ws", "Eisenhower Matrix"
  ];
  const techniqueOptions = [
    "Pomodoro Technique", "Time Blocking", "Eat the Frog", "Task Batching", "Ivy Lee Method"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task, output, framework, technique }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.error || 'Something went wrong');
      }
      setResult(data.result);
    } catch (error) {
      console.error(error);
      // Using a simple alert for error feedback in this example
      alert('An error occurred: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Head>
        <title>Bite-Sized Task AI</title>
        {/* Using Tailwind CSS via CDN for simplicity */}
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <main className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">✅ Bite-Sized Task AI</h1>
          <p className="text-gray-500 mt-2">Turn large goals into an actionable, step-by-step plan.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="task" className="block text-sm font-medium text-gray-700">Main Task / Goal</label>
            <textarea id="task" value={task} onChange={(e) => setTask(e.target.value)} required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows="3" placeholder="e.g., Launch a new podcast from scratch"></textarea>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="output" className="block text-sm font-medium text-gray-700">Desired Final Output</label>
            <textarea id="output" value={output} onChange={(e) => setOutput(e.target.value)} required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows="3" placeholder="e.g., First 3 episodes published and a live website"></textarea>
          </div>
          <div>
            <label htmlFor="framework" className="block text-sm font-medium text-gray-700">Framework</label>
            <select id="framework" value={framework} onChange={(e) => setFramework(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              {frameworkOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="technique" className="block text-sm font-medium text-gray-700">Technique</label>
            <select id="technique" value={technique} onChange={(e) => setTechnique(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              {techniqueOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="col-span-1 md:col-span-2">
            <button type="submit" disabled={loading}
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
              {loading ? 'Generating...' : 'Generate Action Plan'}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-10 p-6 bg-gray-50 rounded-lg prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-800">🚀 Your Action Plan</h2>
            {/* Using a simple pre-wrap for formatting the output */}
            <p className="whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </main>
    </div>
  );
}

