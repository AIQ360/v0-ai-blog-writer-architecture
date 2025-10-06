export default function ArticleOutline({ article }) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-medium">Article outline</h2>
        <div className="text-gray-400 rounded-full border h-4 w-4 flex items-center justify-center text-xs">?</div>
      </div>

      <div className="space-y-4">
        {article.outline.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex items-center gap-2 w-12">
              <div className="text-gray-400">⋮</div>
              <div className="text-xs font-medium text-gray-500">{item.type}</div>
            </div>
            <div className="flex-1">{item.content}</div>
            <div className="text-gray-400">{item.type !== "h1" && "→"}</div>
          </div>
        ))}

        <button className="flex items-center gap-2 mt-4 text-sm text-gray-500 hover:text-gray-700">
          <span>+</span>
          <span>Add new section</span>
        </button>
      </div>
    </div>
  )
}
