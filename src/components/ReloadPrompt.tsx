// import React from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw, X } from 'lucide-react'

function ReloadPrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r)
        },
        onRegisterError(error) {
            console.log('SW registration error', error)
        },
    })

    const close = () => {
        setOfflineReady(false)
        setNeedRefresh(false)
    }

    if (!offlineReady && !needRefresh) return null

    return (
        <div className="fixed bottom-4 right-4 z-50 p-4 bg-white rounded-lg shadow-lg border border-slate-200 max-w-sm animate-fade-in-up">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    <RefreshCw className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-slate-900 mb-1">
                        {offlineReady ? 'App ready to work offline' : 'New content available'}
                    </h3>
                    <p className="text-sm text-slate-500 mb-3">
                        {offlineReady
                            ? 'You can now use this app without internet connection.'
                            : 'Click reload to update to the latest version.'}
                    </p>
                    <div className="flex gap-2">
                        {needRefresh && (
                            <button
                                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 transition-colors"
                                onClick={() => updateServiceWorker(true)}
                            >
                                Reload
                            </button>
                        )}
                        <button
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-200 transition-colors"
                            onClick={close}
                        >
                            Close
                        </button>
                    </div>
                </div>
                <button onClick={close} className="text-slate-400 hover:text-slate-600">
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

export default ReloadPrompt
