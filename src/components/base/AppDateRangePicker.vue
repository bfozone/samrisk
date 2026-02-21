<script setup lang="ts">
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { computed, ref } from 'vue'

const props = defineProps<{
  startDate?: string
  endDate?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:startDate': [value: string]
  'update:endDate': [value: string]
}>()

const currentMonth = ref(new Date())
const selecting = ref<'start' | 'end'>('start')

const year = computed(() => currentMonth.value.getFullYear())
const month = computed(() => currentMonth.value.getMonth())

const monthLabel = computed(() =>
  currentMonth.value.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
)

const days = computed(() => {
  const first = new Date(year.value, month.value, 1)
  const startDay = (first.getDay() + 6) % 7 // Monday = 0
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
})

function prevMonth() {
  currentMonth.value = new Date(year.value, month.value - 1, 1)
}

function nextMonth() {
  currentMonth.value = new Date(year.value, month.value + 1, 1)
}

function toDateString(day: number) {
  return `${year.value}-${String(month.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function selectDay(day: number) {
  const dateStr = toDateString(day)
  if (selecting.value === 'start') {
    emit('update:startDate', dateStr)
    selecting.value = 'end'
  }
  else {
    if (props.startDate && dateStr < props.startDate) {
      emit('update:startDate', dateStr)
    }
    else {
      emit('update:endDate', dateStr)
    }
    selecting.value = 'start'
  }
}

function isInRange(day: number) {
  if (!props.startDate || !props.endDate)
    return false
  const d = toDateString(day)
  return d >= props.startDate && d <= props.endDate
}

function isStart(day: number) {
  return props.startDate === toDateString(day)
}

function isEnd(day: number) {
  return props.endDate === toDateString(day)
}

const displayValue = computed(() => {
  if (props.startDate && props.endDate)
    return `${props.startDate} - ${props.endDate}`
  if (props.startDate)
    return props.startDate
  return ''
})

const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger as-child>
      <button class="inline-flex items-center gap-2 rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors hover:border-border-strong focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50">
        <CalendarDays class="size-3.5 text-muted-foreground" />
        <span :class="!displayValue && 'text-muted-foreground'">
          {{ displayValue || placeholder || 'Select dates' }}
        </span>
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        :side-offset="6"
        side="bottom"
        align="start"
        class="z-50 w-[280px] rounded-lg border border-border bg-popover p-3 shadow-lg animate-in fade-in-0 zoom-in-95"
      >
        <div class="mb-3 flex items-center justify-between">
          <button
            class="flex size-7 items-center justify-center rounded-md bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Previous month"
            @click="prevMonth"
          >
            <ChevronLeft class="size-3.5" />
          </button>
          <span class="text-sm font-semibold text-foreground">{{ monthLabel }}</span>
          <button
            class="flex size-7 items-center justify-center rounded-md bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Next month"
            @click="nextMonth"
          >
            <ChevronRight class="size-3.5" />
          </button>
        </div>
        <div class="grid grid-cols-7 gap-px">
          <div v-for="wd in weekdays" :key="wd" class="p-1 text-center text-[0.6875rem] font-semibold text-muted-foreground">
            {{ wd }}
          </div>
          <template v-for="(day, i) in days" :key="i">
            <div v-if="day === null" class="p-1"></div>
            <button
              v-else
              class="flex h-8 items-center justify-center rounded-md bg-transparent text-[0.8125rem] text-foreground hover:bg-accent"
              :class="{
                'bg-secondary !rounded-none': isInRange(day),
                'bg-primary text-primary-foreground hover:bg-primary/90 !rounded-l-md !rounded-r-none': isStart(day) && !isEnd(day),
                'bg-primary text-primary-foreground hover:bg-primary/90 !rounded-r-md !rounded-l-none': isEnd(day) && !isStart(day),
                'bg-primary text-primary-foreground hover:bg-primary/90 !rounded-md': isStart(day) && isEnd(day),
              }"
              @click="selectDay(day)"
            >
              {{ day }}
            </button>
          </template>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
