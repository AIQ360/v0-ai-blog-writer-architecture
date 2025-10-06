export default function ContentBrief({ article }) {
  return (
    <div className="p-6 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-medium">Keyword search intent</h2>
          <div className="text-gray-400 rounded-full border h-4 w-4 flex items-center justify-center text-xs">?</div>
        </div>
        <div className="p-4 border rounded-md text-sm">{article.keywordIntent}</div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-medium">Article narrative</h2>
          <div className="text-gray-400 rounded-full border h-4 w-4 flex items-center justify-center text-xs">?</div>
        </div>
        <div className="p-4 border rounded-md text-sm">
          {article.narrative.map((item, index) => (
            <div key={index} className="mb-2">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-medium">Target word length</h2>
          <div className="text-gray-400 rounded-full border h-4 w-4 flex items-center justify-center text-xs">?</div>
        </div>
        <div className="p-4 border rounded-md text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">1250</span>
            <span className="text-gray-500">words target</span>
            <span className="ml-4 px-2 py-0.5 bg-gray-100 rounded text-xs">5 sections</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-medium">Questions to cover</h2>
          <div className="text-gray-400 rounded-full border h-4 w-4 flex items-center justify-center text-xs">?</div>
        </div>
        <div className="border rounded-md text-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Question</th>
                <th className="text-left p-3 font-medium">Answer</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {article.questions.map((item, index) => (
                <tr key={index} className={index !== article.questions.length - 1 ? "border-b" : ""}>
                  <td className="p-3">{item.question}</td>
                  <td className="p-3">{item.answer}</td>
                  <td className="p-3 text-center">⋮</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
