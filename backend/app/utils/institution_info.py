"""
Module for handling AMC's institutional information queries
"""

def get_amc_info(query_type='all', language='am'):
    """
    Get AMC's institutional information based on query type
    """
    amc_info = {
        'am': {
            'about': """የአማራ ሚዲያ ኮርፖሬሽን (AMECO) በአማራ ክልል መንግስት የተቋቋመ የመንግስት ሚዲያ ድርጅት ነው። 
ኮርፖሬሽኑ በአማራ ክልል ውስጥ እና ከክልሉ ውጭ ያሉ ህዝቦችን በተለያዩ መድረኮች በመድረስ፣ ትክክለኛ መረጃ በማድረስ እና 
በመዘዴያዊ መንገድ በማስተላለፍ የህብረተሰቡን እውቀት፣ ግንዛቤ እና ተሳትፎ ለማሳደግ ይሰራል።""",

            'mission': """ተልዕኮ፡
• ለህብረተሰቡ ትክክለኛ፣ ወቅታዊ እና አስፈላጊ መረጃዎችን ማድረስ
• የክልሉን እና የሀገሪቱን ልማት፣ ዕድገት እና ሰላም ለማስጠበቅ የበኩሉን አስተዋጽኦ ማድረግ
• የአካባቢውን ባህል፣ ቋንቋ እና ማንነት ለማስጠበቅ እና ለማሳደግ መስራት
• ሙያዊ፣ ነጻ እና ገለልተኛ የሆነ የመገናኛ ብዙሃን አገልግሎት መስጠት""",

            'vision': """ራዕይ፡
በ2025 ዓ.ም. በአፍሪካ ከሚገኙ የመንግስት ሚዲያ ተቋማት መካከል ምርጥ እና ተወዳዳሪ የሆነ፣ በአህጉር ደረጃ እውቅና ያለው 
የመገናኛ ብዙሃን ድርጅት መሆን።""",

            'values': """የኮርፖሬሽኑ እሴቶች፡
• ሙያዊነት
• ተዓማኒነት
• ገለልተኝነት
• ቅንነት
• ተጠያቂነት"""
        },
        'en': {
            'about': """Amhara Media Corporation (AMECO) is a state-owned media organization established by the Amhara Regional Government. 
The corporation works to reach people both within and outside the Amhara region through various platforms, delivering accurate 
information and methodically transmitting it to enhance public knowledge, awareness, and participation.""",

            'mission': """Mission:
• Deliver accurate, timely, and essential information to the public
• Contribute to the region's and country's development, growth, and peace
• Work to preserve and promote local culture, language, and identity
• Provide professional, independent, and impartial media services""",

            'vision': """Vision:
To become one of Africa's leading and competitive state media institutions by 2025, recognized at the continental level.""",

            'values': """Our Values:
• Professionalism
• Reliability
• Impartiality
• Integrity
• Accountability"""
        }
    }

    if query_type == 'mission':
        return amc_info[language]['mission']
    elif query_type == 'vision':
        return amc_info[language]['vision']
    elif query_type == 'about':
        return amc_info[language]['about']
    elif query_type == 'values':
        return amc_info[language]['values']
    else:
        # Return all information formatted nicely
        return f"{amc_info[language]['about']}\n\n{amc_info[language]['mission']}\n\n{amc_info[language]['vision']}\n\n{amc_info[language]['values']}"

def is_institutional_query(query):
    """
    Check if the query is about AMC's institutional information
    """
    query = query.lower()
    institutional_keywords = {
        'mission', 'vision', 'value', 'about amc', 'what is amc', 
        'who is amc', 'tell me about amc', 'information about amc',
        'ተልዕኮ', 'ራዕይ', 'እሴት', 'ስለ አማራ ሚዲያ', 'አማራ ሚዲያ ምንድን ነው',
        'አማራ ሚዲያ ማን ነው', 'ስለ አማራ ሚዲያ ንገረኝ', 'የአማራ ሚዲያ መረጃ'
    }
    
    return any(keyword in query for keyword in institutional_keywords)

def get_query_type(query):
    """
    Determine the type of institutional query
    """
    query = query.lower()
    
    if any(word in query for word in ['mission', 'ተልዕኮ']):
        return 'mission'
    elif any(word in query for word in ['vision', 'ራዕይ']):
        return 'vision'
    elif any(word in query for word in ['value', 'እሴት']):
        return 'values'
    elif any(word in query for word in ['what is', 'who is', 'about', 'ምንድን ነው', 'ማን ነው', 'ስለ']):
        return 'about'
    else:
        return 'all' 