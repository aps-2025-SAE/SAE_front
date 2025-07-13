import React from "react";

import { Calendar, DollarSign, Edit, Trash2, CalendarPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 gap-0">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 text-left">
              {event.title}
            </CardTitle>
          </div>
          <div className="flex gap-1 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(event)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(event)}
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="text-left space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2">
          {event.description}
        </p>

        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            {console.log(event.dateInit, event.dateEnd)}
            <span>{formatDate(event.dateInit)}</span> -
            <span>{formatDate(event.dateEnd)}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarPlus className="h-4 w-4 text-purple-500" />
            <span className="truncate">{event.diaryOffers}</span>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span>R$ {event.budget.toLocaleString("pt-BR")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
