// English and Arabic text for the Labor Planning Calculator.
// Static page text uses data-i18n keys; dynamic text uses the functions below.
const I18N = {
  en: {
    pageTitle: 'Labor Planning Calculator',
    title: 'Labor Planning Calculator',
    subtitle: 'Outbound shift headcount planner · sample data only',
    langBtn: 'العربية',
    exportCsv: 'Export CSV',
    print: 'Print plan',
    reset: 'Reset to sample',
    s1: 'Shift setup',
    s1hint: 'Forecast and shift assumptions. Changes recalculate instantly.',
    volume: 'Forecast volume (units)',
    shift: 'Shift length (hours)',
    breakMin: 'Breaks & meetings (min)',
    indirect: 'Ramp-up & indirect time (%)',
    absent: 'Expected absenteeism (%)',
    prodHrs: 'Productive hours per associate:',
    hoursUnit: 'h',
    s2: 'Process paths',
    s2hint: 'Volume share = % of forecast units that flow through that path. Rate = planned units per labor hour (UPH).',
    thPath: 'Path',
    thShare: 'Volume share %',
    thRate: 'Planned rate (UPH)',
    thAvail: 'Available HC',
    addPath: '+ Add process path',
    newPath: 'New path',
    unnamed: 'Unnamed',
    removePath: 'Remove path',
    s3: 'Headcount plan',
    s3hint: 'Required headcount per path, against what you have on the roster.',
    thUnits: 'Units',
    thHrs: 'Labor hrs',
    thNeeded: 'HC needed',
    thSched: 'HC to schedule',
    thAvailShort: 'Available',
    thStatus: 'Status',
    total: 'Total',
    noPaths: 'Add a process path to start.',
    s4: 'Flex suggestions',
    s4hint: 'Moves surplus associates to short paths, largest gaps first.',
    s4note: 'Only flex associates who are trained and certified on the receiving path.',
    howTitle: 'How the numbers are calculated',
    howList: `
      <li><b>Productive hours</b> = (shift length − breaks) × (1 − indirect %)</li>
      <li><b>Units per path</b> = forecast × volume share %</li>
      <li><b>Labor hours</b> = units ÷ planned rate</li>
      <li><b>HC needed</b> = labor hours ÷ productive hours per associate</li>
      <li><b>HC to schedule</b> = HC needed ÷ (1 − absenteeism %), rounded up</li>
      <li><b>Gap</b> = available HC − HC to schedule</li>
      <li><b>Max shift output</b> per path = available HC × show-up rate × productive hours × rate ÷ volume share. The lowest one is the <b>bottleneck</b>: the whole building can't ship more than that path can process.</li>`,
    builtBy: 'Built by',
    footerNote: 'All figures are illustrative sample data, not from any real site.',

    // status badges
    enterRate: 'Enter a rate',
    short: n => `Short ${n}`,
    overstaffed: n => `Overstaffed +${n}`,
    surplus: n => `Surplus +${n}`,
    balanced: 'Balanced',

    // summary cards
    cSched: 'HC to schedule',
    cSchedSub: p => `incl. ${p}% absenteeism buffer`,
    cAvail: 'Available HC',
    cAvailSub: n => `across ${n} path${n === 1 ? '' : 's'}`,
    cGap: 'Net gap',
    cGapShort: 'building is short overall',
    cGapOk: 'enough people overall',
    cMax: 'Max shift output',
    cBottleneck: name => `bottleneck: <b>${name}</b>`,
    cCovered: 'forecast covered',
    cNotCovered: 'cannot clear forecast',
    cNoData: 'no capacity data',

    // flex suggestions
    flexMove: (m, from, to) => `Move <b>${m}</b> from ${from} → <b>${to}</b>`,
    flexStillShort: n => `Still short ${n}`,
    flexStillShortTip: name => `on ${name}: request overtime, borrow from another department, or agree a lower plan with leadership.`,
    flexSpare: n => `Spare ${n}`,
    flexSpareTip: name => `on ${name}: use for cross-training, 5S, problem solving, or offer voluntary time off.`,
    flexBalanced: 'Every path is exactly balanced. No moves needed.',
    flexEmpty: 'Add process paths to see suggestions.',

    // CSV
    csvForecast: 'Forecast units',
    csvProd: 'Productive hrs per associate',
    csvHeader: ['Path', 'Volume share %', 'Rate (UPH)', 'Units', 'Labor hrs', 'HC needed', 'HC to schedule', 'Available HC', 'Gap'],
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
    s1: 'إعداد الوردية',
    s1hint: 'افتراضات التوقعات والوردية. يتم إعادة الحساب فورًا عند أي تغيير.',
    volume: 'حجم العمل المتوقع (وحدة)',
    shift: 'مدة الوردية (ساعات)',
    breakMin: 'الاستراحات والاجتماعات (دقيقة)',
    indirect: 'وقت بدء التشغيل والعمل غير المباشر (%)',
    absent: 'نسبة الغياب المتوقعة (%)',
    prodHrs: 'الساعات الإنتاجية لكل موظف:',
    hoursUnit: 'ساعة',
    s2: 'مسارات العمليات',
    s2hint: 'نسبة الحجم = نسبة الوحدات المتوقعة التي تمر عبر هذا المسار. المعدل = الوحدات المخططة لكل ساعة عمل (UPH).',
    thPath: 'المسار',
    thShare: 'نسبة الحجم %',
    thRate: 'المعدل المخطط (UPH)',
    thAvail: 'العاملون المتاحون',
    addPath: '+ إضافة مسار عملية',
    newPath: 'مسار جديد',
    unnamed: 'بدون اسم',
    removePath: 'حذف المسار',
    s3: 'خطة عدد العاملين',
    s3hint: 'عدد العاملين المطلوب لكل مسار مقارنةً بالمتاح في جدول الوردية.',
    thUnits: 'الوحدات',
    thHrs: 'ساعات العمل',
    thNeeded: 'العدد المطلوب',
    thSched: 'العدد المطلوب جدولته',
    thAvailShort: 'المتاح',
    thStatus: 'الحالة',
    total: 'الإجمالي',
    noPaths: 'أضف مسار عملية للبدء.',
    s4: 'اقتراحات نقل العاملين',
    s4hint: 'نقل الفائض من العاملين إلى المسارات التي بها نقص، بدءًا بالنقص الأكبر.',
    s4note: 'لا تنقل إلا العاملين المدرّبين والمعتمدين على المسار المستقبِل.',
    howTitle: 'طريقة حساب الأرقام',
    howList: `
      <li><b>الساعات الإنتاجية</b> = (مدة الوردية − الاستراحات) × (1 − نسبة العمل غير المباشر)</li>
      <li><b>الوحدات لكل مسار</b> = الحجم المتوقع × نسبة الحجم</li>
      <li><b>ساعات العمل</b> = الوحدات ÷ المعدل المخطط</li>
      <li><b>العدد المطلوب</b> = ساعات العمل ÷ الساعات الإنتاجية لكل موظف</li>
      <li><b>العدد المطلوب جدولته</b> = العدد المطلوب ÷ (1 − نسبة الغياب)، مقربًا للأعلى</li>
      <li><b>الفجوة</b> = العاملون المتاحون − العدد المطلوب جدولته</li>
      <li><b>أقصى إنتاج للوردية</b> لكل مسار = العاملون المتاحون × نسبة الحضور × الساعات الإنتاجية × المعدل ÷ نسبة الحجم. أقل قيمة هي <b>عنق الزجاجة</b>: لا يمكن للموقع شحن أكثر مما يستطيع هذا المسار معالجته.</li>`,
    builtBy: 'إعداد',
    footerNote: 'جميع الأرقام بيانات تجريبية للتوضيح وليست من أي موقع حقيقي.',

    enterRate: 'أدخل المعدل',
    short: n => `نقص <bdi dir="ltr">${n}</bdi>`,
    overstaffed: n => `زيادة كبيرة <bdi dir="ltr">+${n}</bdi>`,
    surplus: n => `فائض <bdi dir="ltr">+${n}</bdi>`,
    balanced: 'متوازن',

    cSched: 'العدد المطلوب جدولته',
    cSchedSub: p => `يشمل احتياطي غياب <bdi dir="ltr">${p}%</bdi>`,
    cAvail: 'العاملون المتاحون',
    cAvailSub: n => `على ${n} ${n === 1 ? 'مسار' : 'مسارات'}`,
    cGap: 'صافي الفجوة',
    cGapShort: 'الموقع لديه نقص إجمالي',
    cGapOk: 'العدد الإجمالي كافٍ',
    cMax: 'أقصى إنتاج للوردية',
    cBottleneck: name => `عنق الزجاجة: <b>${name}</b>`,
    cCovered: 'يغطي الحجم المتوقع',
    cNotCovered: 'لا يغطي الحجم المتوقع',
    cNoData: 'لا توجد بيانات للطاقة',

    flexMove: (m, from, to) => `انقل <b>${m}</b> من ${from} إلى <b>${to}</b>`,
    flexStillShort: n => `لا يزال النقص ${n}`,
    flexStillShortTip: name => `في ${name}: اطلب عملًا إضافيًا، أو استعِن بقسم آخر، أو اتفق مع الإدارة على خطة أقل.`,
    flexSpare: n => `فائض ${n}`,
    flexSpareTip: name => `في ${name}: استخدمهم في التدريب المتبادل أو 5S أو حل المشكلات، أو اعرض إجازة اختيارية.`,
    flexBalanced: 'جميع المسارات متوازنة تمامًا. لا حاجة لأي نقل.',
    flexEmpty: 'أضف مسارات عمليات لعرض الاقتراحات.',

    csvForecast: 'الحجم المتوقع',
    csvProd: 'الساعات الإنتاجية لكل موظف',
    csvHeader: ['المسار', 'نسبة الحجم %', 'المعدل (UPH)', 'الوحدات', 'ساعات العمل', 'العدد المطلوب', 'العدد المطلوب جدولته', 'العاملون المتاحون', 'الفجوة'],
    csvFile: 'labor-plan-ar.csv'
  }
};
