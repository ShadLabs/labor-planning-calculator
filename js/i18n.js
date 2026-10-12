// English and Arabic text for the Labor Planning Calculator.
// Static page text uses data-i18n keys; dynamic text uses the functions below.
const L = v => `<bdi dir="ltr">${v}</bdi>`; // keeps numbers like +5 or 86% readable in Arabic

const I18N = {
  en: {
    pageTitle: 'Labor Planning Calculator',
    title: 'Labor Planning Calculator',
    subtitle: 'Outbound shift headcount planner · sample data only',
    langBtn: 'العربية',
    exportCsv: 'Export CSV',
    print: 'Print plan',
    reset: 'Reset to sample',

    // overview
    s0: 'Shift at a glance',
    seePlan: 'See full plan ↓',
    vNoDataTitle: 'Waiting for data',
    vNoData: 'Add process paths with planned rates to see the shift outlook.',
    vOkTitle: 'On track',
    vOk: (cap, pct, fc, net) => `With the current assignment the shift can process <b>${cap}</b> units, ${L(pct + '%')} of the ${fc} forecast. Net gap is <b>${L(net)}</b>.`,
    vRebalTitle: 'Rebalance needed',
    vRebal: (bn, cap, pct, net) => `<b>${bn}</b> limits the shift to <b>${cap}</b> units (${L(pct + '%')} of forecast). You have enough people overall (net ${L(net)}). Apply the moves below to clear the forecast.`,
    vShortTitle: 'At risk',
    vShort: (cap, pct, n) => `Even after rebalancing, the shift can only process <b>${cap}</b> units (${L(pct + '%')} of forecast). You need about <b>${n}</b> more ${n === 1 ? 'person' : 'people'}, overtime, or a lower plan agreed with leadership.`,
    vOverAssigned: (a, t) => `Assigned headcount (${a}) is more than the total on shift (${t}). Check the numbers in Process paths.`,
    actionsTitle: 'Top actions',

    kMax: 'Max shift output',
    kMaxSub: (pct, fc) => `${L(pct + '%')} of ${fc} forecast`,
    kBottleneck: name => `Bottleneck: <b>${name}</b>`,
    kGap: 'Net gap',
    kGapSub: (t, s) => `${t} on shift vs ${s} to schedule`,
    kReb: 'Output if rebalanced',
    kRebSub: t => `with all ${t} people placed where needed`,
    kUnassigned: 'Unassigned',
    kUnassignedSub: (a, t) => `${a} of ${t} assigned to paths`,
    kOverSub: n => `over-assigned by ${n}`,
    covered: 'clears forecast',
    notCovered: 'below forecast',

    // shift setup
    s1: 'Shift setup',
    s1hint: 'Forecast, headcount and shift assumptions. Changes recalculate instantly.',
    volume: 'Forecast volume (units)',
    totalHc: 'Total outbound HC on shift',
    shift: 'Shift length (hours)',
    breakMin: 'Breaks & meetings (min)',
    indirect: 'Ramp-up & indirect time (%)',
    absent: 'Expected absenteeism (%)',
    prodHrs: 'Productive hours per associate:',
    hoursUnit: 'h',

    // paths
    s2: 'Process paths',
    s2hint: 'Volume share = % of forecast units that flow through that path. Rate = planned units per labor hour (UPH). Assigned HC = people placed on that path at start of shift.',
    thPath: 'Path',
    thShare: 'Volume share %',
    thRate: 'Planned rate (UPH)',
    thAvail: 'Assigned HC',
    addPath: '+ Add process path',
    newPath: 'New path',
    unnamed: 'Unnamed',
    removePath: 'Remove path',
    assignLine: (a, t, u) => `Assigned <b>${a}</b> of <b>${t}</b> on shift · Unassigned <b>${u}</b>`,
    assignOver: (a, t, n) => `Assigned <b>${a}</b> of <b>${t}</b> on shift · <b>Over-assigned by ${n}</b>`,

    // plan table
    s3: 'Headcount plan',
    s3hint: 'Required headcount per path, against who is assigned.',
    thUnits: 'Units',
    thHrs: 'Labor hrs',
    thNeeded: 'HC needed',
    thSched: 'HC to schedule',
    thAvailShort: 'Assigned',
    thStatus: 'Status',
    total: 'Total',
    noPaths: 'Add a process path to start.',

    // flex
    s4: 'Flex suggestions',
    s4hint: 'Fills short paths from the unassigned pool first, then from surplus paths, largest gaps first.',
    s4note: 'Only flex associates who are trained and certified on the receiving path.',
    howTitle: 'How the numbers are calculated',
    howList: `
      <li><b>Productive hours</b> = (shift length − breaks) × (1 − indirect %)</li>
      <li><b>Units per path</b> = forecast × volume share %</li>
      <li><b>Labor hours</b> = units ÷ planned rate</li>
      <li><b>HC needed</b> = labor hours ÷ productive hours per associate</li>
      <li><b>HC to schedule</b> = HC needed ÷ (1 − absenteeism %), rounded up</li>
      <li><b>Path gap</b> = assigned HC − HC to schedule</li>
      <li><b>Net gap</b> = total outbound HC on shift − total HC to schedule</li>
      <li><b>Max shift output</b> per path = assigned HC × show-up rate × productive hours × rate ÷ volume share. The lowest one is the <b>bottleneck</b>: the building can't ship more than that path can process.</li>
      <li><b>Output if rebalanced</b> = total HC × show-up rate × productive hours ÷ the labor hours each unit needs across all paths. It shows what the same people could ship if placed perfectly.</li>`,
    builtBy: 'Built by',
    footerNote: 'All figures are illustrative sample data, not from any real site.',

    // status badges
    enterRate: 'Enter a rate',
    short: n => `Short ${n}`,
    overstaffed: n => `Overstaffed +${n}`,
    surplus: n => `Surplus +${n}`,
    balanced: 'Balanced',

    // flex suggestions
    flexPool: (m, to) => `Assign <b>${m}</b> from the unassigned pool → <b>${to}</b>`,
    flexMove: (m, from, to) => `Move <b>${m}</b> from ${from} → <b>${to}</b>`,
    flexStillShort: n => `Still short ${n}`,
    flexStillShortTip: name => `on ${name}: request overtime, borrow from another department, or agree a lower plan with leadership.`,
    flexSpare: n => `Spare ${n}`,
    flexSpareTip: name => `on ${name}: use for cross-training, 5S, problem solving, or offer voluntary time off.`,
    flexPoolLeft: n => `${n} unassigned`,
    flexPoolLeftTip: 'keep as floaters to cover breaks and volume spikes.',
    flexBalanced: 'Every path is exactly balanced. No moves needed.',
    flexEmpty: 'Add process paths to see suggestions.',

    // CSV
    csvForecast: 'Forecast units',
    csvTotal: 'Total outbound HC on shift',
    csvProd: 'Productive hrs per associate',
    csvMax: 'Max shift output (current assignment)',
    csvReb: 'Output if rebalanced',
    csvNet: 'Net gap',
    csvHeader: ['Path', 'Volume share %', 'Rate (UPH)', 'Units', 'Labor hrs', 'HC needed', 'HC to schedule', 'Assigned HC', 'Gap'],
    csvFile: 'labor-plan.csv'
  },

  ar: {
    pageTitle: 'حاسبة تخطيط القوى العاملة',
    title: 'حاسبة تخطيط القوى العاملة',
    subtitle: 'مخطط عدد العاملين لوردية الشحن الصادر · بيانات تجريبية فقط',
    langBtn: 'English',
    exportCsv: 'تصدير CSV',
    print: 'طباعة الخطة',
    reset: 'استعادة البيانات التجريبية',

    s0: 'الوردية في لمحة',
    seePlan: 'عرض الخطة كاملة ↓',
    vNoDataTitle: 'بانتظار البيانات',
    vNoData: 'أضف مسارات العمليات مع المعدلات المخططة لعرض توقعات الوردية.',
    vOkTitle: 'ضمن الخطة',
    vOk: (cap, pct, fc, net) => `بالتوزيع الحالي تستطيع الوردية معالجة <b>${cap}</b> وحدة، أي ${L(pct + '%')} من الحجم المتوقع ${fc}. صافي الفجوة <b>${L(net)}</b>.`,
    vRebalTitle: 'يلزم إعادة التوزيع',
    vRebal: (bn, cap, pct, net) => `مسار <b>${bn}</b> يحد إنتاج الوردية عند <b>${cap}</b> وحدة (${L(pct + '%')} من المتوقع). العدد الإجمالي كافٍ (صافي ${L(net)}). طبّق التحركات أدناه لتغطية الحجم المتوقع.`,
    vShortTitle: 'في خطر',
    vShort: (cap, pct, n) => `حتى بعد إعادة التوزيع، لا تستطيع الوردية معالجة أكثر من <b>${cap}</b> وحدة (${L(pct + '%')} من المتوقع). تحتاج إلى نحو <b>${n}</b> ${n === 1 ? 'عامل' : 'عاملين'} إضافيين، أو عمل إضافي، أو خطة أقل بالاتفاق مع الإدارة.`,
    vOverAssigned: (a, t) => `عدد العاملين المعيّنين (${a}) أكبر من الإجمالي في الوردية (${t}). راجع الأرقام في مسارات العمليات.`,
    actionsTitle: 'أهم الإجراءات',

    kMax: 'أقصى إنتاج للوردية',
    kMaxSub: (pct, fc) => `${L(pct + '%')} من المتوقع ${fc}`,
    kBottleneck: name => `عنق الزجاجة: <b>${name}</b>`,
    kGap: 'صافي الفجوة',
    kGapSub: (t, s) => `${t} في الوردية مقابل ${s} مطلوب جدولتهم`,
    kReb: 'الإنتاج بعد إعادة التوزيع',
    kRebSub: t => `عند توزيع جميع العاملين (${t}) حسب الحاجة`,
    kUnassigned: 'غير معيّنين',
    kUnassignedSub: (a, t) => `${a} من ${t} معيّنون على المسارات`,
    kOverSub: n => `زيادة في التعيين بمقدار ${n}`,
    covered: 'يغطي المتوقع',
    notCovered: 'أقل من المتوقع',

    s1: 'إعداد الوردية',
    s1hint: 'افتراضات الحجم والعاملين والوردية. يتم إعادة الحساب فورًا عند أي تغيير.',
    volume: 'حجم العمل المتوقع (وحدة)',
    totalHc: 'إجمالي عاملي الصادر في الوردية',
    shift: 'مدة الوردية (ساعات)',
    breakMin: 'الاستراحات والاجتماعات (دقيقة)',
    indirect: 'وقت بدء التشغيل والعمل غير المباشر (%)',
    absent: 'نسبة الغياب المتوقعة (%)',
    prodHrs: 'الساعات الإنتاجية لكل موظف:',
    hoursUnit: 'ساعة',

    s2: 'مسارات العمليات',
    s2hint: 'نسبة الحجم = نسبة الوحدات المتوقعة التي تمر عبر هذا المسار. المعدل = الوحدات المخططة لكل ساعة عمل (UPH). العاملون المعيّنون = من تم توزيعهم على المسار في بداية الوردية.',
    thPath: 'المسار',
    thShare: 'نسبة الحجم %',
    thRate: 'المعدل المخطط (UPH)',
    thAvail: 'العاملون المعيّنون',
    addPath: '+ إضافة مسار عملية',
    newPath: 'مسار جديد',
    unnamed: 'بدون اسم',
    removePath: 'حذف المسار',
    assignLine: (a, t, u) => `المعيّنون <b>${a}</b> من <b>${t}</b> في الوردية · غير المعيّنين <b>${u}</b>`,
    assignOver: (a, t, n) => `المعيّنون <b>${a}</b> من <b>${t}</b> في الوردية · <b>زيادة في التعيين بمقدار ${n}</b>`,

    s3: 'خطة عدد العاملين',
    s3hint: 'عدد العاملين المطلوب لكل مسار مقارنةً بالمعيّنين عليه.',
    thUnits: 'الوحدات',
    thHrs: 'ساعات العمل',
    thNeeded: 'العدد المطلوب',
    thSched: 'العدد المطلوب جدولته',
    thAvailShort: 'المعيّن',
    thStatus: 'الحالة',
    total: 'الإجمالي',
    noPaths: 'أضف مسار عملية للبدء.',

    s4: 'اقتراحات نقل العاملين',
    s4hint: 'تغطية المسارات التي بها نقص من العاملين غير المعيّنين أولًا، ثم من المسارات التي بها فائض، بدءًا بالنقص الأكبر.',
    s4note: 'لا تنقل إلا العاملين المدرّبين والمعتمدين على المسار المستقبِل.',
    howTitle: 'طريقة حساب الأرقام',
    howList: `
      <li><b>الساعات الإنتاجية</b> = (مدة الوردية − الاستراحات) × (1 − نسبة العمل غير المباشر)</li>
      <li><b>الوحدات لكل مسار</b> = الحجم المتوقع × نسبة الحجم</li>
      <li><b>ساعات العمل</b> = الوحدات ÷ المعدل المخطط</li>
      <li><b>العدد المطلوب</b> = ساعات العمل ÷ الساعات الإنتاجية لكل موظف</li>
      <li><b>العدد المطلوب جدولته</b> = العدد المطلوب ÷ (1 − نسبة الغياب)، مقربًا للأعلى</li>
      <li><b>فجوة المسار</b> = العاملون المعيّنون − العدد المطلوب جدولته</li>
      <li><b>صافي الفجوة</b> = إجمالي عاملي الصادر في الوردية − إجمالي العدد المطلوب جدولته</li>
      <li><b>أقصى إنتاج للوردية</b> لكل مسار = العاملون المعيّنون × نسبة الحضور × الساعات الإنتاجية × المعدل ÷ نسبة الحجم. أقل قيمة هي <b>عنق الزجاجة</b>: لا يمكن للموقع شحن أكثر مما يستطيع هذا المسار معالجته.</li>
      <li><b>الإنتاج بعد إعادة التوزيع</b> = إجمالي العاملين × نسبة الحضور × الساعات الإنتاجية ÷ ساعات العمل التي تحتاجها كل وحدة عبر جميع المسارات. يوضح ما يمكن للعاملين أنفسهم شحنه لو تم توزيعهم بشكل مثالي.</li>`,
    builtBy: 'إعداد',
    footerNote: 'جميع الأرقام بيانات تجريبية للتوضيح وليست من أي موقع حقيقي.',

    enterRate: 'أدخل المعدل',
    short: n => `نقص ${L(n)}`,
    overstaffed: n => `زيادة كبيرة ${L('+' + n)}`,
    surplus: n => `فائض ${L('+' + n)}`,
    balanced: 'متوازن',

    flexPool: (m, to) => `خصّص <b>${m}</b> من العاملين غير المعيّنين إلى <b>${to}</b>`,
    flexMove: (m, from, to) => `انقل <b>${m}</b> من ${from} إلى <b>${to}</b>`,
    flexStillShort: n => `لا يزال النقص ${n}`,
    flexStillShortTip: name => `في ${name}: اطلب عملًا إضافيًا، أو استعِن بقسم آخر، أو اتفق مع الإدارة على خطة أقل.`,
    flexSpare: n => `فائض ${n}`,
    flexSpareTip: name => `في ${name}: استخدمهم في التدريب المتبادل أو 5S أو حل المشكلات، أو اعرض إجازة اختيارية.`,
    flexPoolLeft: n => `${n} غير معيّنين`,
    flexPoolLeftTip: 'احتفظ بهم كاحتياط متنقل لتغطية الاستراحات وارتفاع الحجم.',
    flexBalanced: 'جميع المسارات متوازنة تمامًا. لا حاجة لأي نقل.',
    flexEmpty: 'أضف مسارات عمليات لعرض الاقتراحات.',

    csvForecast: 'الحجم المتوقع',
    csvTotal: 'إجمالي عاملي الصادر في الوردية',
    csvProd: 'الساعات الإنتاجية لكل موظف',
    csvMax: 'أقصى إنتاج للوردية (التوزيع الحالي)',
    csvReb: 'الإنتاج بعد إعادة التوزيع',
    csvNet: 'صافي الفجوة',
    csvHeader: ['المسار', 'نسبة الحجم %', 'المعدل (UPH)', 'الوحدات', 'ساعات العمل', 'العدد المطلوب', 'العدد المطلوب جدولته', 'العاملون المعيّنون', 'الفجوة'],
    csvFile: 'labor-plan-ar.csv'
  }
};
