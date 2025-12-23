import { CheckCircle2 } from "lucide-react"

interface TimelineStep {
  title: string
  subtitle?: string
  date: string
  time: string
}

interface OrderTrackingTimelineProps {
  steps: TimelineStep[]
}

export default function OrderTrackingTimeline({ steps }: OrderTrackingTimelineProps) {
  return (
    <div className="flex-1  rounded-2xl border border-gray-300 bg-white p-8">
      <div className="flex gap-6">
        {/* Timeline */}
        <div className="flex flex-col items-center gap-0">
          {steps.map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Circle with checkmark */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-yellow-400 bg-white">
                <CheckCircle2 className="h-6 w-6 text-yellow-400" />
              </div>
              {/* Connecting line */}
              {index < steps.length - 1 && <div className="h-16 w-1 bg-yellow-400"></div>}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {steps.map((step, index) => (
            <div key={index} className="mb-8 flex items-start justify-between gap-4 last:mb-0">
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                {step.subtitle && <p className="mt-1 text-sm text-gray-500">{step.subtitle}</p>}
              </div>
              <div className="whitespace-nowrap text-right text-sm text-gray-600">
                <p>{step.date}</p>
                <p>{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
