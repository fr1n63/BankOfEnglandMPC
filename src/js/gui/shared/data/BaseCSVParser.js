/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 14/03/2011
 * Time: 14:06
 * To change this template use File | Settings | File Templates.
 */

var gui = gui || {};
gui.data = gui.data || {};

(function ()
{
    var string = gui.string;

    gui.data.BaseCsvParser = function(delimiter, fieldNames, skipFinal)
    {
        this.delimiter = delimiter ? delimiter : '\t';
        this.skipFinal = skipFinal != false;
        this.data = null;
        this.fieldNames = null;
    };

    gui.data.BaseCsvParser.prototype =
    {
        isValid: function()
        {
            return (data != null);
        },

        parse: function(data)
        {
            var text = data;
            var firstRow;
            var finalRow;
            var currentRow;

            var records = [];
            var lines = text.split(/\r\n|\r|\n/);
            var count = lines.length;

            firstRow = this.parseFirstRow(lines[0]);

            if (firstRow)
            {
                records.push(firstRow);
            }

            for (var i = 1; i <= count - 2; ++i)
            {
                var line = lines[i];

                if (line.length == 0)
                {
                    continue;
                }

                currentRow = this.parseRow(line.split(this.delimiter));

                if (currentRow)
                {
                    records.push(currentRow);
                }
            }

            finalRow = this.parseFinalRow(lines[count - 1]);

            if (finalRow)
            {
                records.push(finalRow);
            }

            return this.buildData(records);
        },

        buildData: function(records)
        {
            return records;
        },

        getFieldNames: function()
        {
            return this.fieldNames;
        },

        parseFirstRow: function (line)
        {
            if (this.fieldNames == null)
            {
                this.fieldNames = line.split(this.delimiter);//.map(prepFieldName);

                for (var i = 0; i < this.fieldNames.length; i++)
                {
                    this.fieldNames[i] = string.trim(string.stripQuotes(this.fieldNames[i]));
                }

                return null;
            }
            else
            {
                return this.parseRow(line.split(this.delimiter));
            }
        },

        parseFinalRow:function (line)
        {
            return (line.indexOf(this.delimiter) < 0) ? null : this.parseRow(line.split(this.delimiter));
        },

        prepFieldName:function (item, index, arr)
        {
            return string.stripQuotes(item);
        },

        parseRow:function (fields)
        {
            var record = {};

            if (fields.length < this.fieldNames.length)
            {
                return null;
            }

            for (var j = 0; j < this.fieldNames.length; ++j)
            {
                record[this.fieldNames[j]] = string.stripQuotes(fields[j]);
            }

            return record;
        }
    };

}());