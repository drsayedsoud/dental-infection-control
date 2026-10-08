import re

with open('src/data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add images to existing topics
content = content.replace('subtitle: "Infection Control Concepts & Chain of Infection",\n    content:', 'subtitle: "Infection Control Concepts & Chain of Infection",\n    imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800",\n    content:')

content = content.replace('subtitle: "Hand Hygiene",\n    content:', 'subtitle: "Hand Hygiene",\n    imageUrl: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&q=80&w=800",\n    content:')

content = content.replace('subtitle: "Personal Protective Equipment (PPE)",\n    content:', 'subtitle: "Personal Protective Equipment (PPE)",\n    imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&q=80&w=800",\n    content:')

content = content.replace('subtitle: "Central Sterile Services Department & Reprocessing",\n    content:', 'subtitle: "Central Sterile Services Department & Reprocessing",\n    imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800",\n    content:')

content = content.replace('subtitle: "Rotary Instruments & Dental Unit Waterlines (DUWLs)",\n    content:', 'subtitle: "Rotary Instruments & Dental Unit Waterlines (DUWLs)",\n    imageUrl: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=800",\n    content:')

content = content.replace('subtitle: "Environment, Waste, & Sharps Management",\n    content:', 'subtitle: "Environment, Waste, & Sharps Management",\n    imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceef7?auto=format&fit=crop&q=80&w=800",\n    content:')


new_topics = '''  {
    id: 11,
    title: "الاحتياطات التنفسية وآداب السعال",
    subtitle: "Respiratory Hygiene & Cough Etiquette",
    imageUrl: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&q=80&w=800",
    content: `تُعد عيادة الأسنان بيئة عالية المخاطر لالتقاط العدوى التنفسية بسبب قرب الطبيب من فم المريض وتطاير الرذاذ.
    
لذلك يجب اتباع الاحتياطات التالية:
- توفير كمامات للمرضى الذين يعانون من أعراض تنفسية في صالة الانتظار.
- توفير مناديل ورقية وسلال مهملات تفتح بالقدم.
- توجيه المرضى لتغطية الفم والأنف عند السعال أو العطس، والتخلص من المنديل فوراً، ثم تطهير الأيدي.
- في حال الاشتباه بمرض تنفسي معدي (كالسُل أو كوفيد)، يجب تأجيل العلاج السني غير الطارئ، وإذا كان طارئاً يُعالج المريض في غرفة عزل ذات ضغط سالب (إن أمكن) مع ارتداء قناع عالي الكفاءة N95.`,
    question: {
      text: "ما هو التصرف الأمثل مع مريض أسنان غير طارئ يعاني من سعال مستمر واشتباه بعدوى تنفسية؟",
      options: ["علاجه فوراً للتخلص من المشكلة", "تأجيل العلاج السني غير الطارئ حتى يتعافى المريض", "إعطاؤه مسكن وعلاجه في نفس اليوم", "علاجه باستخدام كمامة جراحية عادية"],
      correctAnswer: 1,
      explanation: "الدليل القومي ينصح بتأجيل جميع الإجراءات السنية غير الطارئة للمرضى المصابين بعدوى تنفسية نشطة حماية للطبيب والمرضى الآخرين."
    }
  },
  {
    id: 12,
    title: "تخزين الآلات المعقمة",
    subtitle: "Storage of Sterile Items",
    imageUrl: "https://images.unsplash.com/photo-1628177142898-93e46e4624d4?auto=format&fit=crop&q=80&w=800",
    content: `بعد خروج الآلات من الأوتوكلاف، يُعد التخزين السليم أمراً حتمياً للحفاظ على التعقيم:

- يجب أن تحفظ الآلات المغلفة في دواليب مغلقة أو أدراج نظيفة وجافة تماماً.
- يُمنع تخزين الآلات المعقمة تحت أحواض المياه أو في أماكن معرضة للرطوبة أو الحشرات.
- يجب فحص الغلاف (Pouch) قبل الاستخدام؛ إذا كان ممزقاً أو رطباً أو مفتوحاً، تُعتبر الآلة غير معقمة ويجب إعادة دورتها بالكامل.
- يُكتب تاريخ التعقيم على الغلاف، وتُطبق قاعدة (ما يُدخل أولاً، يُستخدم أولاً - FIFO) لضمان عدم انتهاء الصلاحية.`,
    question: {
      text: "ماذا تفعل إذا وجدت غلاف أداة جراحية (Pouch) معقمة يحتوي على تمزق صغير جداً قبل استخدامه؟",
      options: ["استخدامه طالما التمزق صغير", "مسح الأداة بكحول ثم استخدامها", "اعتبار الأداة ملوثة وإعادة عملية التنظيف والتغليف والتعقيم بالكامل", "تغطية التمزق بشريط لاصق"],
      correctAnswer: 2,
      explanation: "أي تمزق أو ثقب أو رطوبة في الغلاف يكسر حاجز التعقيم فوراً، ويجب إعادة معالجة الأداة بالكامل بدءاً من التنظيف."
    }
  }
];'''

content = content.replace('];', new_topics)

with open('src/data.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated data.js with images and new topics')
